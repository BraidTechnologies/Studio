'use strict';
// Copyright Braid Technologies ltd, 2024
import { MDynamicStreamable } from '../core/StreamingFramework';
import { Message} from '../core/Message';
import { IKeyGenerator } from '../core/IKeyGenerator';
import { getDefaultKeyGenerator } from '../core/IKeyGeneratorFactory';

import { IRelevantEnrichedChunk } from '../../BraidCommon/src/EnrichedChunk';

import { expect } from 'expect';
import { describe, it } from 'mocha';

var keyGenerator: IKeyGenerator = getDefaultKeyGenerator();

var myId: string = "1234";
var myAuthorId: string = "Jon";
var myResponseToId: string = "abcd";
var myText = "Hello";
var mySentAt = new Date();

var someoneElsesId: string = "5678";
var someoneElsesAuthorId: string = "Barry";
var someoneElsesResponseTo: string = "abcdefgh";
var someoneElsesText = "Bye";
var someoneElsesSentAt = new Date(0);

describe("Message", function () {

   var message1: Message, message2: Message, messageErr:Message;

   message1 = new Message(myId, myAuthorId, myResponseToId, myText, mySentAt);

   message2 = new Message(someoneElsesId, someoneElsesAuthorId, someoneElsesResponseTo, someoneElsesText, someoneElsesSentAt);

   it("Needs to construct an empty object", function () {

      var messageEmpty = new Message();

      expect(messageEmpty.text).toEqual("");
      expect(messageEmpty.responseToId).toEqual(undefined);
      expect(messageEmpty.isUnPrompted()).toEqual(true);
      expect(keyGenerator.couldBeAKey (messageEmpty.id)).toEqual(true);      
   });

   it("Needs to allow undefined ID", function () {

      var caught: boolean = false;
      try {
         messageErr = new Message(undefined, myId, myResponseToId, myText, mySentAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(false);
   });

   it("Needs to detect invalid ID", function () {

      var caught: boolean = false;
      try {
         messageErr = new Message(1 as unknown as string, myId, myResponseToId, myText,  mySentAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });


   it("Needs to compare for equality and inequality", function () {

      var messageNew: Message = new Message(message1.id, message1.authorId, message1.responseToId, message1.text, message1.sentAt);

      expect(message1.equals(message1)).toEqual(true);
      expect(message1.equals(messageNew)).toEqual(true);
      expect(message1.equals(message2)).toEqual(false);
   });
   
   
   it("Needs to detect inequality on date", function () {

      var messageNew: Message = new Message(message1.id, message1.authorId, message1.responseToId, message1.text, new Date());

      expect(message1.equals(messageNew)).toEqual(false);
   });

   it("Needs to throw error if checkedResponseToId is not satisfied", function () {

      var messageEmpty = new Message();

      var caught: boolean = false;
      try {
         let thumb = messageEmpty.checkedResponseToId;

      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });

   it("Needs to correctly store attributes", function () {
         
      expect(message1.authorId === myAuthorId).toEqual(true);
      expect(message1.responseToId === myResponseToId).toEqual(true);
      expect(message1.isUnPrompted()).toEqual(false);      
      expect(message1.sentAt.getTime() === mySentAt.getTime()).toEqual(true);
   });

   it("Needs to copy construct", function () {

      let persona2: Message = new Message(message1);

      expect(message1.equals(persona2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      var messageNew: Message = new Message(message1.id, message1.authorId, message1.responseToId, message1.text, message1.sentAt);

      messageNew.id = someoneElsesId;
      messageNew.text = someoneElsesText;
      messageNew.authorId = someoneElsesAuthorId;
      messageNew.responseToId = someoneElsesResponseTo;
      messageNew.sentAt = someoneElsesSentAt;

      expect(message2.equals (messageNew)).toEqual(true);
   });

   it("Needs to catch errors on change id attributes", function () {

      var caught: boolean = false;
      try {
         message1.id = 1 as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);

   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = message1.streamOut();

      var messageNew: Message = new Message(message1.id, message1.authorId, message1.responseToId, message1.text, message1.sentAt);
      messageNew.streamIn(stream);

      expect(message1.equals(messageNew)).toEqual(true);
   });

   it("Needs to convert to and from JSON() with KnowledgeSources attached", function () {

      let ks1 = {
         chunk: {
            url: "https://test", 
            summary: message1.text,
            text: message1.text
         },
         relevance: 0.8
      };
      let messageWithSources = new Message (message1);

      let sources = new Array<IRelevantEnrichedChunk> ();
      sources.push (ks1);
      messageWithSources.chunks = sources;      
      var stream: string = messageWithSources.streamOut();

      var messageNew: Message = new Message(message1.id, message1.authorId, message1.responseToId, message1.text, message1.sentAt);

      messageNew.streamIn(stream);

      expect(messageWithSources.equals(messageNew)).toEqual(true);
   });   

   it("Needs to dynamically create Message to and from JSON()", function () {

      var stream: string = message1.flatten();

      var messageNew: Message = new Message();

      expect(message1.equals(messageNew)).toEqual(false);

      messageNew = MDynamicStreamable.resurrect(stream) as Message;

      expect(message1.equals(messageNew)).toEqual(true);
   });

   it("Needs to dynamically create Message to and from JSON() with KnowledgeSources attached", function () {

      let ks1 = {
         chunk: {
            url: "https://test", 
            summary: message1.text,
            text: message1.text
         },
         relevance: 0.8
      };
      let messageWithSources = new Message (message1);

      let sources = new Array<IRelevantEnrichedChunk> ();
      sources.push (ks1);
      messageWithSources.chunks = sources;      
     
      var stream: string = messageWithSources.flatten();

      var messageNew: Message = new Message();

      expect(messageWithSources.equals(messageNew)).toEqual(false);

      messageNew = MDynamicStreamable.resurrect(stream) as Message;

      expect(messageWithSources.equals(messageNew)).toEqual(true);
   });   

   it("Needs to count with tokens KnowledgeSources attached", function () {

      let ks1 = {chunk: {
            url: "https://test", 
            summary: message1.text,
            text: message1.text
         },
         relevance: 0.8
      };

      var messageNew: Message = new Message();  
      expect(messageNew.isDirty).toEqual(true);          
      expect(messageNew.tokens > 1).toEqual(false);
      expect(messageNew.isDirty).toEqual(false);   

      messageNew.text = "Some text and a bit more x y x help this needs to be longer than 2 tokens";

      expect(messageNew.tokens > 1).toEqual(true);
      expect(messageNew.isDirty).toEqual(false); 

      let messageWithSources = new Message (messageNew);
      expect(messageWithSources.isDirty).toEqual(true); 

      let sources = new Array<IRelevantEnrichedChunk> ();
      sources.push (ks1);
      messageWithSources.chunks = sources;      
      expect(messageWithSources.isDirty).toEqual(true);         
      expect(messageWithSources.tokens > 2).toEqual(true);
      expect(messageWithSources.isDirty).toEqual(false);       
   });    

});