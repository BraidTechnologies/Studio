'use strict';
// Copyright Braid Technologies ltd, 2024
import { throwIfUndefined } from '../core/Asserts';
import { Message, MessageStreamingHandler} from '../core/Message';
import { Embedding } from '../core/Embedding';
import { Persona} from '../core/Persona';
import { EIcon } from '../core/Icons';
import { SessionKey } from '../core/Keys';
import { KStubEnvironmentVariables} from '../core/ConfigStrings'; 
import { EEnvironment, Environment } from '../core/Environment';
import { AIConnection, AIConnector } from '../core/AIConnection';

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
      let caller = await AIConnector.connect (new SessionKey (process.env.SessionKey)); 

      let query = caller.buildDirectQuery (messages, authors);

      expect(query.length).toEqual(3);         
   });    
   
   it("Needs to generate valid response from Open AI web endpoint", async function () {

      let messages = new Array<Message>();
      messages.length = 2;
      messages[0] = personMessage;
      messages[1] = botRequest;

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        

      let caller = await AIConnector.connect (new SessionKey (process.env.SessionKey));             
      let fullQuery = caller.buildDirectQuery (messages, authors);
      let message = new Message();      
      let result = await caller.makeEnrichedCall (message, fullQuery);

      expect (result.text.length > 0).toBe(true);
   }).timeout(20000);   

   it("Needs to generate valid response from Open AI web endpoint using streaming API", async function () {

      let messages = new Array<Message>();
      messages.length = 2;
      messages[0] = personMessage;
      messages[1] = botRequest;

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        

      let caller = await AIConnector.connect (new SessionKey (process.env.SessionKey));             
      let fullQuery = caller.buildDirectQuery (messages, authors);
      let message = new Message();

      let called = false;
      function handler (text: Message, more: boolean) {
         called = true;
      }

      message.hookLiveAppend (handler);

      let result = await caller.makeSingleStreamedCall (fullQuery, message);
      message.unhookLiveAppend ();

      expect (result.length > 0).toBe(true);
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

      let caller = await AIConnector.connect (new SessionKey (process.env.SessionKey));             
      let fullQuery = caller.buildQueryForQuestionPrompt (messages, authors);
      let message = new Message();

      let result = await caller.makeSingleCall (fullQuery, message);

      expect (message.text.length > 0).toBe(true);    
      expect (message.isStreaming).toBe(false);              
   }).timeout(20000); 

   function makeLongMessage (startingMessage: Message, segmentCount: number) : Message {

      let segments = new Array<Embedding>();      

      // Make a list of knowledge sources, each with 500 tokens
      for (var i = 0; i < segmentCount; i++) {
         
         let accumulatedText = "Hi";

         for (var j = 0; j < 4000; j++) {
            accumulatedText = accumulatedText.concat (" token");
         }
         let ks1 = new Embedding("makeUpUrl", accumulatedText, new Array<number>(), undefined, undefined);
         segments.push (ks1);
      }
      
      let newBotRequest = new Message (startingMessage);
      newBotRequest.chunks = segments;

      return newBotRequest;
   }
   it("Needs to detect when token limit is OK", async function () {

      let messages = new Array<Message>();

      messages.length = 3;
      messages[0] = personMessage;
      messages[1] = botRequest;
      messages[2] = makeLongMessage (botMessage, 2);

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        
      let caller = await AIConnector.connect (new SessionKey (process.env.SessionKey)); 

      let query = caller.buildDirectQuery (messages, authors);

      expect(query.length).toEqual(5);         
   });    

   it("Needs to detect when token limit overflows", async function () {

      let messages = new Array<Message>();

      messages.length = 4;
      messages[0] = personMessage;
      messages[1] = botRequest;
      messages[2] = makeLongMessage (botMessage, 4);
      messages[3] = botRequest;      

      throwIfUndefined(process);
      throwIfUndefined(process.env);
      throwIfUndefined(process.env.SessionKey);        
      let caller = await AIConnector.connect (new SessionKey (process.env.SessionKey)); 

      let query = caller.buildDirectQuery (messages, authors);

      expect(query.length).toEqual(2);         
   });      
});


describe("AIConnector", function () {

   beforeEach(async () => {

      this.timeout(20000);   
   });

   it("Needs to connect to valid stub API", async function () {

      let caught = false;
      try {
         let connection = await AIConnector.connect (new SessionKey(KStubEnvironmentVariables.SessionKey));
      }
      catch (e) {
         caught = true;
      }
      expect(caught).toEqual(false);         
   });    
   
   it("Needs to return a connection on successful communication with real back end", async function () {

      let caught = false;
      
      // Force use of actual API calls rather than local stubs
      let oldEnv = Environment.override (EEnvironment.kProduction);

      try {
         let connection = await AIConnector.connect (new SessionKey(KStubEnvironmentVariables.SessionKey));
      }
      catch (err) {
         caught = true;
      }
      Environment.override (oldEnv);          

      expect(caught).toEqual(false);      

   }).timeout (10000);    

   it("Needs to detect error on failure to connect to back end", async function () {

      let caught = false;
      
      // Force use of actual API calls rather than local stubs
      let oldEnv = Environment.override (EEnvironment.kProduction);

      try {
         let connection = await AIConnector.connect (new SessionKey ("thiswillfail"));
      }
      catch (err) {
         caught = true;
      }
      Environment.override (oldEnv);          

      expect(caught).toEqual(true);    

   }).timeout (10000);   

});