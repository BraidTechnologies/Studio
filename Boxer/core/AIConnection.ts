// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module AIConnection
 * @description Manages communication with AI/LLM services in the Boxer application.
 * 
 * This module provides the AIConnection class which handles:
 * - Making enriched queries to LLM models with context
 * - Streaming responses back to the UI
 * - Managing conversation history and token limits
 * - Tracking active call state
 * - Building enriched queries from message history
 * 
 * The connection requires a session key for authentication and uses the environment 
 * configuration to determine appropriate API endpoints. It works with the QueryModelApi
 * to make actual API calls while providing higher-level conversation management.
 */


// Local
import { SessionKey } from "./Keys";
import { Message } from './Message';
import { Persona } from './Persona';
import { EIcon } from './Icons';
import { EConfigNumbers, EConfigStrings } from './ConfigStrings';
import { throwIfUndefined } from './Asserts';
import { AssertionFailedError } from "./Errors";
import { getDefaultKeyGenerator } from "./IKeyGeneratorFactory";

import { getDefaultEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EChunkRepository, IRelevantEnrichedChunk} from '../../CommonTs/src/EnrichedChunk';

import { IEnrichedQuery, IEnrichedResponse, IGenerateQuestionQuery, IQuestionGenerationResponse } from '../../CommonTs/src/EnrichedQuery';
import { EModelConversationRole, IModelConversationElement } from "../../CommonTs/src/IModelDriver";
import { QueryModelApi } from '../../CommonTs/src/QueryModelApi';

// We allow for the equivalent of 10 minutes of chat. 10 mins * 60 words = 600 words = 2400 tokens. 
const kMaxTokens : number= 4096;

export class AIConnection {

   private _activeCallCount: number; 
   private _queryModelApi : QueryModelApi;

   /**
    * Create an AIConnection object 
    */
   constructor(sessionKey_: SessionKey) {

      this._activeCallCount = 0;  
      this._queryModelApi = new QueryModelApi (getDefaultEnvironment (), sessionKey_.toString())
   }  

   // Makes an Axios call to call web endpoint
   // Make two queries - one to get the answer to the direct question, another to ask for a reference summary. 
   // The reference summary is then used to look up good articles to add to the response.  
   async makeEnrichedCall  (responseShell: Message, query: IEnrichedQuery) : Promise<Message | undefined> {

      let response = await this._queryModelApi.queryModelWithEnrichment (query);

      if (response) {
         this.streamResponse (responseShell, response);
      }
          
      return responseShell;                                                                            
   }    

   // Asks the LLM for a question that relates to the context  
   async makeFollowUpCall  (summary: string) : Promise<Message | undefined> {
      
      let followUpQuery = AIConnection.buildQueryForQuestionPrompt (summary);

      let response = await this._queryModelApi.generateQuestion (followUpQuery);

      if (response) {
         let keyGenerator = getDefaultKeyGenerator();
         return new Message (keyGenerator.generateKey(), EConfigStrings.kLLMGuid, undefined, 
                             response.question, new Date()); 
      }
      return undefined;                                                                       
   } 

   
   /**
    * Asynchronously streams the enriched response to update the message shell with chunks and live updates.
    * This is a confidence trick - e give the appearance of streaming, not the actuality. 
    * Only reason is that we are going to shutt off dedicated client & move to an API model - so real streaming wont be processsed here. 
    * 
    * @param responseShell - The message shell to be updated with the enriched response.
    * @param response - The enriched response containing answer and relevant enriched chunks.
    * @returns A promise that resolves with the updated message shell after streaming the response.
    */
   private async streamResponse  (responseShell: Message, response: IEnrichedResponse) : Promise<Message> {

      let done = new Promise<Message>(async function(resolve, reject) {

         let responseChunks = response.chunks;

         let shellChunks = new Array<IRelevantEnrichedChunk>();
         shellChunks.length = responseChunks.length;

         for (let i = 0; i < responseChunks.length; i++) {

            let shellEmbed = {chunk: {
                  url: responseChunks[i].chunk.url,
                  summary: responseChunks[i].chunk.summary,
                  text: responseChunks[i].chunk.text
               }, 
               relevance: responseChunks[i].relevance};
            shellChunks[i] = shellEmbed;
         }

         responseShell.chunks = shellChunks;
         let index = 0;
         let maxIndex = 6; 

         let interval = setInterval ( () => {

            switch (index) {
               case 0:
                  let text1 = response.answer.slice (0, response.answer.length / 2);
                  responseShell.liveUpdateText (text1, true);
                  break;  
               case 1:
                  let text2 = response.answer;
                  responseShell.liveUpdateText (text2, true);                     
                  break;                                      
               case 2:
                  if (responseChunks.length > 0) {
                     shellChunks[0].chunk.summary = responseChunks[0].chunk.summary.slice (0, responseChunks[0].chunk.summary.length / 2);
                     responseShell.liveUpdateChunks (shellChunks, true);               
                  }       
                  break;
               case 3:
                  if (responseChunks.length > 1)                  {
                     shellChunks[1].chunk.summary = responseChunks[1].chunk.summary.slice (0, responseChunks[0].chunk.summary.length / 2);  
                     responseShell.liveUpdateChunks (shellChunks, true);                              
                  }             
                  break;  
               case 4:
                  if (responseChunks.length > 0)              { 
                     shellChunks[0].chunk.summary = responseChunks[0].chunk.summary;     
                     responseShell.liveUpdateChunks (shellChunks, true);                              
                  }                                     
                  break;   
               case 5:
                  if (responseChunks.length > 1)          {        
                     shellChunks[1].chunk.summary = responseChunks[1].chunk.summary;    
                     responseShell.liveUpdateChunks (shellChunks, true);            
                  }       
                  break;         
               default:
                  break;                                                 
            }

            index++;
            if (index === maxIndex) {
               responseShell.liveUpdateChunks (shellChunks, false); 
               resolve (responseShell);
               clearInterval(interval);
            }

         }, 100); 
      });

      return done;
   }

   isBusy () {
      return this._activeCallCount !== 0;
   }

   static buildEnrichmentQuery (messages: Array<Message>, authors: Map<string, Persona>): IEnrichedQuery {

      let history = new Array<IModelConversationElement> ();
      let question = "";    

      var start = AIConnection.findEarliestMessageIndexWithinTokenLimit(messages, authors);

      for (let i = start; i < messages.length; i++) {

         let message = messages[i];

         if (AIConnection.isRequestForLLM(message, authors)) {

            // The last message contains the question. 
            if (i === messages.length -1) {
               // Remove the name of our LLM
               let edited = message.text.replace (EConfigStrings.kLLMRequestSignature, "");   
               
               // Expand 'LLM' to Large Language Model (LLM) as that seems to make a big difference to document hits 
               // This includes some common typos
               let lookFor = [EConfigStrings.kPromptLookFor1, EConfigStrings.kPromptLookFor2, ,
                              EConfigStrings.kPromptLookFor4, EConfigStrings.kPromptLookFor5, EConfigStrings.kPromptLookFor6
                             ] as Array<string>;
               
               let replaceWith = [EConfigStrings.kPromptReplaceWith1, EConfigStrings.kPromptReplaceWith2, EConfigStrings.kPromptReplaceWith3,
                                 EConfigStrings.kPromptReplaceWith4, EConfigStrings.kPromptReplaceWith5, EConfigStrings.kPromptReplaceWith6
                                ] as Array<string>;
               
               for (let i = 0; i < lookFor.length; i++) {
                  if (edited.includes (lookFor[i])) 
                     edited = edited.replace (lookFor[i], replaceWith[i]);
               }             
               
               question = edited;      
            } 
            else {
               // else we just remove the name of our LLM
               let edited = message.text.replace (EConfigStrings.kLLMRequestSignature, "");
               let entry = { role: EModelConversationRole.kUser, content: edited };
               history.push (entry);
            }
         }

         if (AIConnection.isFromLLM(message, authors)) {
            
            let entry = { role: EModelConversationRole.kAssistant, content: message.text };
            history.push (entry);     

            for (let j = 0; j < message.chunks.length; j++) {
               let entry = { role: EModelConversationRole.kAssistant, content: message.chunks[j].chunk.summary };
               history.push (entry);
            }                   
         }         

      }

      let query = {
         repositoryId: EChunkRepository.kBoxer,
         question : question,
         history: history,
         maxCount: 2,
         similarityThreshold : 0.4,
         wordTarget: 50
      } 

      return query; 
   }   

   static buildQueryForQuestionPrompt (summary: string): IGenerateQuestionQuery {

      let query = {
         wordTarget: 10,
         summary: summary
      } 

      return query; 
   }   

   static buildTranscript (messages: Array<Message>, authors: Map<string, Persona>): string {

      let builtQuery : string = "";
   

      var start = AIConnection.findEarliestMessageIndexWithinTokenLimit(messages, authors);

      for (let i = start; i < messages.length; i++) {

         let message = messages[i];

         if (AIConnection.isFromLLM(message, authors)) {
            
            builtQuery = builtQuery + EConfigStrings.kLLMName + ":" + message.text + "\n";
         }            
         else {
            let author = authors.get (message.authorId);
            if (!author)
               author = Persona.unknown();

            builtQuery = builtQuery + author.name + ":" + message.text + "\n";
         }      
      }

      return builtQuery; 
   }  
    

   private static findEarliestMessageIndexWithinTokenLimit (messages: Array<Message>, authors: Map<string, Persona>) : number {

      if (messages.length == 0)      
         throw new AssertionFailedError ("Message array is zero length.");
      if (messages.length == 1)
         return 0;

      let tokenAccumulator = 0;
      let iLowest = 0;
      let lowestIndex = Math.max (0, messages.length - EConfigNumbers.kMaxMessagesBack)

      for (let i = messages.length - 1; i >= lowestIndex && tokenAccumulator < kMaxTokens; i--) {

         tokenAccumulator += messages[i].tokens;

         if (tokenAccumulator < kMaxTokens)
            iLowest = i;
      }      
      return iLowest;
   }

   /**
    * is a message from the LLM - look at the author ID
    */
   static isFromLLM (message: Message, authors: Map<string, Persona>) : boolean {

      let author = Persona.safeAuthorLookup (authors, message.authorId);
      throwIfUndefined (author);

      return (author.icon === EIcon.kLLMPersona);
   }


   /**
    * is a message invoking the LLM - look at the author, and if the message contains the LLM name 
    */
   static isRequestForLLM (message: Message, authors: Map<string, Persona>) : boolean {

      let author = Persona.safeAuthorLookup (authors, message.authorId);
      throwIfUndefined (author);

      return (author.icon === EIcon.kPersonPersona) && 
      (message.text.includes (EConfigStrings.kLLMRequestSignature) || message.text.includes (EConfigStrings.kLLMRequestSignatureLowerCase));
   }

  /**
    * is a message an attempt to invoke the LLM - look at the author, and if the message contains miss-spellings of LLM name 
    */
   static mightBeMissTypedRequestForLLM (message: Message, authors: Map<string, Persona>) : boolean {

      if (this.isRequestForLLM (message, authors))
         return false;

      let author = Persona.safeAuthorLookup (authors, message.authorId);
      throwIfUndefined (author);

      return (author.icon === EIcon.kPersonPersona) && 
         (message.text.includes (EConfigStrings.kLLMNearRequestSignature) || message.text.includes (EConfigStrings.kLLMNearRequestSignatureLowerCase));
   }   
}