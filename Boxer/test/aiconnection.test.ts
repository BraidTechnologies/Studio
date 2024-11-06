'use strict';
// Copyright Braid Technologies ltd, 2024
import { throwIfUndefined } from '../core/Asserts';
import { Message} from '../core/Message';
import { Persona} from '../core/Persona';
import { EIcon } from '../core/Icons';
import { SessionKey } from '../core/Keys';
import { KStubEnvironmentVariables} from '../core/ConfigStrings'; 
import { AIConnection } from '../core/AIConnection';
import { makeSummaryCall } from '../core/ApiCalls';

import { IRelevantEnrichedChunk } from '../../CommonTs/src/EnrichedChunk';

import { expect } from 'expect';
import { describe, it } from 'mocha';

let myMessageId: string = "1234";
let myAuthorId: string = "Jon";
let myText = "Boxer What is back propagation?";
let mySentAt = new Date();

let botMessageId: string = "5678";
let botAuthorId: string = "Bot";
let botText = "Back propogation is a technique used to train nueral networks.";
var botSentAt = new Date(0);

let myBotRequestId: string = "12345";
let myBotRequestText = "Hello @Boxer What is back propagation?";

async function sleep(msec: number) {
   return new Promise(resolve => setTimeout(resolve, msec));
}

describe("AIConnection", async function () {

   let authors = new Map<string, Persona> ();
   let person = new Persona (myAuthorId, myAuthorId, "", EIcon.kPersonPersona, undefined, new Date());   
   let bot = new Persona (botAuthorId, botAuthorId, "", EIcon.kLLMPersona, undefined, new Date());
   authors.set (person.id, person);
   authors.set (bot.id, bot);

   let personMessage = new Message(myMessageId, myAuthorId, undefined, myText, mySentAt);
   let botMessage = new Message(botMessageId, botAuthorId, undefined, botText, botSentAt);
   let botRequest = new Message(myBotRequestId, myAuthorId, undefined, myBotRequestText, mySentAt); 
   this.timeout(20000);

   beforeEach(async () => {

      this.timeout(20000);           
   });

   it("Needs to detect Bot message type", function () {

      var messageEmpty = new Message();

      expect(AIConnection.isFromLLM(botMessage, authors)).toEqual(true);
      expect(AIConnection.isFromLLM(personMessage, authors)).toEqual(false); 
      expect(AIConnection.isFromLLM(botRequest, authors)).toEqual(false);           
   });

   it("Needs to detect Bot request type", function () {

      expect(AIConnection.isRequestForLLM(personMessage, authors)).toEqual(false);   
      expect(AIConnection.isRequestForLLM(botMessage, authors)).toEqual(false);     
      expect(AIConnection.isRequestForLLM(botRequest, authors)).toEqual(true);          
   });   

   it("Needs to detect near-miss Bot request type", function () {

      expect(AIConnection.mightBeMissTypedRequestForLLM (personMessage, authors)).toEqual(true);   
      expect(AIConnection.mightBeMissTypedRequestForLLM(botMessage, authors)).toEqual(false);
      expect(AIConnection.mightBeMissTypedRequestForLLM(botRequest, authors)).toEqual(false);                 
   });   

   it("Needs to allow reference errors & return false", function () {

      var newMessage = new Message(personMessage);
      newMessage.authorId = "Banana";
  
      let caught = false;
      let answer = false;

      try {
         answer = AIConnection.isFromLLM(newMessage, authors);
      }
      catch (e) {
         caught = true;
      }
      expect(caught).toEqual(false);      
      expect(answer).toEqual(false);          
   });   

   it("Needs to build request object", async function () {

      let messages = new Array<Message>();
      messages.length = 3;
      messages[0] = personMessage;
      messages[1] = botRequest;
      messages[2] = botMessage;

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        

      let query = AIConnection.buildEnrichmentQuery (messages, authors);

      expect(query.history.length).toEqual(2);         
   });       

   it("Needs to generate valid response from Open AI web endpoint using streaming API", async function () {

      let messages = new Array<Message>();
      messages.length = 2;
      messages[0] = personMessage;
      messages[1] = botRequest;

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        

      let caller = new AIConnection (new SessionKey (process.env.SessionKey));                
      let fullQuery = AIConnection.buildEnrichmentQuery (messages, authors);
      let message = new Message();

      let called = false;
      function handler (text: Message, more: boolean) {
         called = true;
      }

      message.hookLiveAppend (handler);

      let result = await caller.makeEnrichedCall (message, fullQuery);

      await sleep (10000);

      message.unhookLiveAppend ();

      expect (message.text.length > 0).toBe(true);    
      expect (message.isStreaming).toBe(false);    
      expect (called).toBe(true);    

   }).timeout(20000); 

   it("Needs to generate valid response from Open AI web endpoint using basic API", async function () {

      let messages = new Array<Message>();
      messages.length = 2;
      messages[0] = personMessage;
      messages[1] = botRequest;
     
      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey); 

      let caller = new AIConnection (new SessionKey (process.env.SessionKey));             
      let message = new Message();

      let result = await caller.makeFollowUpCall ("This article explains how Transformers work.");

      expect (result && result.text.length > 0).toBe(true);    
      expect (result && result.isStreaming).toBe(false);              
   }).timeout(20000); 

   function makeLongMessage (startingMessage: Message, segmentCount: number) : Message {

      let segments = new Array<IRelevantEnrichedChunk>();      

      // Make a list of knowledge sources, each with > 1000 tokens
      for (var i = 0; i < segmentCount; i++) {
         
         let accumulatedText = "Hi";

         for (var j = 0; j < 500; j++) {
            accumulatedText = accumulatedText.concat (" token");
         }
         let ks1 = {
            chunk: {
               url: "https://test", 
               summary: accumulatedText,
               text: accumulatedText
            },
            relevance: 0.8
         };
         segments.push (ks1);
      }
      
      let newBotRequest = new Message (startingMessage);
      newBotRequest.chunks = segments;

      return newBotRequest;
   }
   it("Needs to detect when token limit is OK", async function () {

      let messages = new Array<Message>();

      messages.length = 4;
      messages[0] = personMessage;
      messages[1] = botRequest;
      messages[2] = makeLongMessage (botMessage, 2); // This ends up as two mesages as we have a long message and a long chunk. 
      messages[3] = botRequest;

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        

      let query = AIConnection.buildEnrichmentQuery (messages, authors);

      expect(query.history.length).toEqual(4);         
   });    

   it("Needs to detect when token limit overflows", async function () {

      let messages = new Array<Message>();

      messages.length = 4;
      messages[0] = personMessage;
      messages[1] = botRequest;
      messages[2] = makeLongMessage (botMessage, 20);
      messages[3] = botRequest;      

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        

      let query = AIConnection.buildEnrichmentQuery (messages, authors);

      expect(query.history.length).toEqual(0);         
   });      
});


describe("APIs", function () {

   it("Needs to call summariser", async function () {

      let caught = false;
      let session = new SessionKey(KStubEnvironmentVariables.SessionKey);
      let text = "OpenAI have released a new model called OpenAI-O, where the O stands for omni channel. They have also released a small version of this."
      let summary : string | undefined = "";

      try {
         summary = await makeSummaryCall (session, text);
      }
      catch (e) {
         caught = true;
      }
      expect(caught).toEqual(false);      
      expect(summary && summary.length > 0).toEqual(true);              
   }).timeout(20000);       
   
});