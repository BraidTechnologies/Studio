// Copyright (c) 2024 Braid Technologies Ltd
import axios from "axios";

// Local
import { SessionKey } from "./Keys";
import { logApiError, logApiInfo } from "./Logging";
import { Message } from './Message';
import { Embedding } from "./Embedding";
import { Persona } from './Persona';
import { EIcon } from './Icons';
import { EConfigNumbers, EConfigStrings } from './ConfigStrings';
import { throwIfUndefined } from './Asserts';
import { AssertionFailedError } from "./Errors";
import { KeyRetriever } from "./KeyRetriever";
import { Environment, EEnvironment } from "./Environment";
import { IEmbeddingRepository, kDefaultSearchChunkCount, kDefaultMinimumCosineSimilarity} from "./IEmbeddingRepository";
import { getEmbeddingRepository } from "./IEmbeddingRepositoryFactory";
import { getDefaultKeyGenerator } from "./IKeyGeneratorFactory";
import { parse } from "path";

// We allow for the equivalent of 10 minutes of chat. 10 mins * 60 words = 600 words = 2400 tokens. 
const kMaxTokens : number= 4096;

export class AIMessageElement {
   role: string;
   content: string;

   constructor () {
      this.role = "";
      this.content = "";
   }
}

export class AIConnection {

   private _activeCallCount: number;
   private _aiKey: string;  
   private _embeddings: IEmbeddingRepository;

   /**
    * Create an AIConnection object 
    */
   constructor(aiKey_: string, sessionKey_: SessionKey) {

      this._activeCallCount = 0;
      this._aiKey = aiKey_;
      this._embeddings = getEmbeddingRepository (sessionKey_);
   }  

   // Makes an Axios call to call web endpoint
   // Make two queries - one to get the anser to the direct question, another to ask for a reference summary. 
   // The reference summary is then used to look up good articles to add to the response.  
   async makeEnrichedCall  (responseShell: Message, allMessages: Array<AIMessageElement>) : Promise<Message> {
          
      let enrichedQuery = this.buildEnrichmentQuery (allMessages);      

      const [directResponse, enrichedResponse] = await Promise.all ([this.makeSingleStreamedCall (allMessages, responseShell), 
                                                                     this.makeSingleCallInternal (enrichedQuery)]);
      logApiInfo ("Enriched question for lookup:", enrichedResponse);    
      
      if (!enrichedResponse.includes (EConfigStrings.kResponseNotRelevantMarker)
      &&  !enrichedResponse.includes (EConfigStrings.kResponseDontKnowMarker)) {

         let embedding = await this.createEmbedding (enrichedResponse);

         let enriched = await this._embeddings.lookupMostSimilar (embedding, undefined, kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount);
                              
         responseShell.text = directResponse;

         await this.streamEnrichment (responseShell, enriched.chunks);
          
         return responseShell;          
      }  
      else {
         responseShell.text = directResponse;   
         return responseShell;     
      }                                                                  
   }    

   // Asks the LLM for a question that relates to the context  
   async makeFollowUpCall  (context: string) : Promise<Message> {
      
      let followUpQuery = this.buildFollowUpQuery (context);      

      const [enrichedResponse] = await Promise.all ([this.makeSingleCallInternal (followUpQuery)]);
                              
      let keyGenerator = getDefaultKeyGenerator();
      return new Message (keyGenerator.generateKey(), EConfigStrings.kLLMGuid, undefined, 
                          enrichedResponse, new Date());                                                                        
   } 

   // Asks the LLM for a question that relates to the context  
   async makeSingleCall  (input: Array<AIMessageElement>, output: Message) : Promise<Message> {            
   
      const [response] = await Promise.all ([this.makeSingleCallInternal (input)]);
                                 
      let keyGenerator = getDefaultKeyGenerator();
      output.text = response;  
                          
      return output;
   } 

   // Makes an Axios call to call web endpoint using the streaming API
   async makeSingleStreamedCall  (input: Array<AIMessageElement>, output: Message) : Promise<string> {
      
      let self = this;
      self._activeCallCount++;

      output.isStreaming = true;

      let inBrowser = (typeof Blob !== "undefined");
      inBrowser = true; // Force use of Fetch as it works on Browser and in Node. 
            
      let done = new Promise<string>(async function(resolve, reject) {
   
         function parseData (data: any ) : void {

            const lines = data
               ?.toString()
               ?.split("\n")
               .filter((line: string) => line.trim() !== "");
   
               for (const line of lines) {
                  const text = line.replace(/^data: /, "");
                  if (text === "[DONE]") {
                     output.liveAppendText ("", false);  
                     self._activeCallCount--;                                             
                     resolve (output.text);
                  } else {
                     let token = undefined;
                     try {
                        let parsed = JSON.parse(text);
                        let choice = parsed && parsed.choices ? parsed.choices[0] : undefined
                        token = choice && choice.delta && choice.delta.content ? choice.delta.content : undefined;
                     } catch {
                        console.error (text);
                     }
                     if (token) {                       
                        output.liveAppendText (token, true);
                    }
                 }
              }
         }           
   
         if (true) {           

            const response = await fetch('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'api-key': self._aiKey
               },
               body: JSON.stringify({
                  messages: input,
                  stream: true
               }),
             });

             const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
             throwIfUndefined(reader);

             while (true) {
               const { value, done } = await reader.read();
               if (done) {
                  self._activeCallCount--;                     
                  break;
               }

               parseData (value);
            }
         }
         else {

            const completion = await axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
               messages: input,
               stream: true
            },
            {   
               responseType: "stream",
               headers: {
                  'Content-Type': 'application/json',
                  'api-key': self._aiKey
               }
            });
   
            completion.data.on("data", (data: string) => {
   
               parseData (data);
            })
            .on ("error", (data: string) => {
               self._activeCallCount--;            
               output.liveAppendText ("", false);              
               reject();               
            });
         }
      });

      return done;
   } 

   async streamEnrichment  (responseShell: Message, embeddings: Array<Embedding>) : Promise<Message> {

      let done = new Promise<Message>(async function(resolve, reject) {

         let shellEmbeddings = new Array<Embedding>();
         shellEmbeddings.length = embeddings.length;

         for (let i = 0; i < embeddings.length; i++) {
            let shellEmbed = new Embedding (embeddings[i].url, "", embeddings[i].ada_v2, embeddings[i].timeStamp, embeddings[i].relevance);
            shellEmbeddings[i] = shellEmbed;
         }

         responseShell.chunks = shellEmbeddings;
         let index = 0;
         let maxIndex = 4; 

         if (shellEmbeddings.length > 0) {
            let interval = setInterval ( () => {

               switch (index) {
                  case 0:
                     if (embeddings.length > 0)
                        shellEmbeddings[0].summary = embeddings[0].summary.slice (0, embeddings[0].summary.length / 2);
                     break;
                  case 1:
                     if (embeddings.length > 1)                  
                        shellEmbeddings[1].summary = embeddings[1].summary.slice (0, embeddings[0].summary.length / 2);                  
                     break;  
                  case 2:
                     if (embeddings.length > 0)                  
                        shellEmbeddings[0].summary = embeddings[0].summary;                  
                     break;   
                  case 3:
                     if (embeddings.length > 1)                  
                        shellEmbeddings[1].summary = embeddings[1].summary;                       
                     break;         
                  default:
                     break;                                                 
               }

               responseShell.liveAppendChunks (shellEmbeddings, index == 3? false: true);

               index++;
               if (index === maxIndex) {
                  resolve (responseShell);
                  clearInterval(interval);
               }
            }, 100);
         } 
         else {
            resolve (responseShell);            
         }
      });

      return done;
   }

      // Makes an Axios call to call web endpoint
   async createEmbedding  (input: string) : Promise<Array<number>> {
      
      let self = this;
      self._activeCallCount++;
   
      let done = new Promise<Array<number>>(function(resolve, reject) {

         // AZURE POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/embeddings?api-version={api-version}
         // OPENAI POST 'https://api.openai.com/v1/embeddings'

         axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlmse/embeddings?api-version=2024-02-01', {
            input: input,
            // OPENAI model: "text-embedding-ada-002",       
         },
         {
            headers: {
               'Content-Type': 'application/json',
               // OpenAI - 'Authorization': `Bearer ${this._key}`
               'api-key': self._aiKey           
            }
         })
         .then((resp : any) => {
   
            self._activeCallCount--;               
            resolve (resp.data.data[0].embedding as Array<number>);      
         })
         .catch((error: any) => {
   
            self._activeCallCount--;     
            logApiError (EConfigStrings.kErrorConnectingToAiAPI, error);
            reject();
         });
      });

      return done;
   } 

   isBusy () {
      return this._activeCallCount !== 0;
   }

   buildDirectQuery (messages: Array<Message>, authors: Map<string, Persona>): Array<AIMessageElement> {

      let builtQuery = new Array<AIMessageElement> ();

      let prompt = { role: 'system', content: EConfigStrings.kOpenAiPersonaPrompt };
      builtQuery.push (prompt);      

      var start = this.findEarliestMessageIndexWithinTokenLimit(messages, authors);

      for (let i = start; i < messages.length; i++) {

         let message = messages[i];

         if (AIConnection.isRequestForLLM(message, authors)) {

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

               let engineeredQuestion = EConfigStrings.kInitialQuestionPrompt + EConfigStrings.kEnrichmentQuestionPrefix + edited;      
               let entry = { role: 'user', content: engineeredQuestion };
               builtQuery.push (entry);
            } 
            else {

               let edited = message.text.replace (EConfigStrings.kLLMRequestSignature, "");
               let entry = { role: 'user', content: edited };
               builtQuery.push (entry);
            }
         }

         if (AIConnection.isFromLLM(message, authors)) {
            
            let entry = { role: 'assistant', content: message.text };
            builtQuery.push (entry);     

            for (let j = 0; j < message.chunks.length; j++) {
               let entry = { role: 'assistant', content: message.chunks[j].summary };
               builtQuery.push (entry);
            }                   
         }         

      }
      return builtQuery; 
   }   

   buildQueryForQuestionPrompt (messages: Array<Message>, authors: Map<string, Persona>): Array<AIMessageElement> {

      let builtQuery = new Array<AIMessageElement> ();

      let prompt = { role: 'system', content: EConfigStrings.kOpenAiPersonaPrompt };
      builtQuery.push (prompt);      

      var start = this.findEarliestMessageIndexWithinTokenLimit(messages, authors);

      for (let i = start; i < messages.length; i++) {

         let message = messages[i];

         if (AIConnection.isFromLLM(message, authors)) {
            
            let entry = { role: 'assistant', content: message.text };
            builtQuery.push (entry);     

            for (let j = 0; j < message.chunks.length; j++) {
               let entry = { role: 'assistant', content: message.chunks[j].summary };
               builtQuery.push (entry);
            }                   
         }            
         else {
               let edited = message.text.replace (EConfigStrings.kLLMRequestSignature, "");
               let entry = { role: 'user', content: edited };
               builtQuery.push (entry);
         }      
      }

      let engineeredQuestion = EConfigStrings.kGenerateAQuestionPrompt;      
      let entry = { role: 'user', content: engineeredQuestion };
      builtQuery.push (entry);

      return builtQuery; 
   }   


   buildEnrichmentQuery (messages: Array<AIMessageElement>): Array<AIMessageElement> {

      let builtQuery = new Array<AIMessageElement> ();
      
      let engineeredPrompt = EConfigStrings.kEnrichmentPrompt;
      let prompt = { role: 'system', content: engineeredPrompt };
      builtQuery.push (prompt);        

      let lastMessage = messages[messages.length -1].content;
      let engineeredQuestion = EConfigStrings.kEnrichmentQuestionPrefix + lastMessage;      
      let entry = { role: 'user', content: engineeredQuestion };
      builtQuery.push (entry);

      return builtQuery; 
   } 

   buildFollowUpQuery (context: string): Array<AIMessageElement> {

      let builtQuery = new Array<AIMessageElement> ();
      
      let engineeredPrompt = EConfigStrings.kFollowUpPrompt;
      let prompt = { role: 'system', content: engineeredPrompt };
      builtQuery.push (prompt);        

      let engineeredQuestion = EConfigStrings.kFollowUpPrefix + context;      
      let entry = { role: 'user', content: engineeredQuestion };
      builtQuery.push (entry);

      return builtQuery; 
   } 

   // Makes an Axios call to call web endpoint
   private async makeSingleCallInternal  (input: Array<AIMessageElement>) : Promise<string> {
      
      let self = this;
      self._activeCallCount++;

      let done = new Promise<string>(function(resolve, reject) {

         // OPENAI POST ('https://api.openai.com/v1/chat/completions', {
         // AZURE POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/chat/completions?api-version={api-version}

         axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
            messages: input,
            // OPENAI model: "gpt-3.5-turbo"
            // OPENAI prompt: allMessages
         },
         {
            headers: {
               'Content-Type': 'application/json',
               // OpenAI - 'Authorization': `Bearer ${this._key}`
               'api-key': self._aiKey
            }
         })
         .then((resp : any) => {
            
            self._activeCallCount--;   
            resolve (resp.data.choices[0].message.content);   
         })
         .catch((error: any) => {

            self._activeCallCount--;     

            logApiError (EConfigStrings.kErrorConnectingToAiAPI, error);
            reject();
         });
      });
   
      return done;
   }      

   private findEarliestMessageIndexWithinTokenLimit (messages: Array<Message>, authors: Map<string, Persona>) : number {

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

export class AIConnector {
   
   static async connect (sessionKey_: SessionKey) : Promise<AIConnection> {

      let retriever = new KeyRetriever ();
      var url: string;

      if (Environment.environment() === EEnvironment.kLocal)
         url = EConfigStrings.kRequestLocalAiKeyUrl;
      else
         url = EConfigStrings.kRequestAiKeyUrl;

      let aiKey = await retriever.requestKey (url, 
                                       EConfigStrings.kSessionParamName, 
                                       sessionKey_);

      return new AIConnection (aiKey, sessionKey_);
   }
}