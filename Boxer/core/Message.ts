// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module Message
 * @description Provides a class for managing messages in the Boxer application.
 * 
 * This module includes the Message class which handles:
 * - Creating and managing message objects with text, author, responseTo, and timestamp
 * - Supporting multiple constructor patterns for initialization
 * - Copying message objects from JSON or constructed sources
 */

import GPT4Tokenizer from 'gpt4-tokenizer';

import { InvalidParameterError } from './Errors';
import { throwIfUndefined } from './Asserts';
import { IKeyGenerator } from './IKeyGenerator';
import { getDefaultKeyGenerator } from './IKeyGeneratorFactory';
import { MDynamicStreamable, DynamicStreamableFactory } from "./StreamingFramework";
import { areSameDate, areSameDeepArray } from './Utilities';
import { IRelevantEnrichedChunk } from '../../CommonTs/src/EnrichedChunk';

const keyGenerator: IKeyGenerator = getDefaultKeyGenerator();
const tokenizer = new GPT4Tokenizer({ type: 'gpt3' });

const className = "Message";

export type MessageStreamingHandler = (message: Message, more: boolean) => void;

// Message - text, plus IDs for the message itself, if its a reply, the person who sent it, and a date-time stamp
export class Message extends MDynamicStreamable {
   private _id: string;
   private _authorId: string;
   private _responseToId: string | undefined;
   private _text: string;
   private _sentAt: Date;
   private _chunks: Array<IRelevantEnrichedChunk>;
   private _tokens: number;
   private _isTokenCacheDirty: boolean;
   private _isStreaming: boolean;
   private _streamHandler: MessageStreamingHandler | undefined;

   /**
    * Create an empty Message object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a Message object
    * @param id_ - id to use to generate uniqueness 
    * @param authorId_ - Id of the person who sent it
    * @param responseToId_ - id of the message to which it is a response, can be undefined
    * @param text_ - the message body
    * @param sentAt - timestamp for last interaction seen by the framework
    */
   public constructor(id_: string | undefined, authorId_: string | undefined, responseToId_: string | undefined, text_: string, sentAt: Date);

   /**
    * Create a Message object
    * @param id_ - id to use to generate uniqueness 
    * @param authorId_ - Id of the person who sent it
    * @param responseToId_ - id of the message to which it is a response, can be undefined
    * @param text_ - the message body
    * @param sentAt - timestamp for last interaction seen by the framework
    * @param chunks_ - relevent knowledge sources that help understand / provide context for the message. 
    */
   public constructor(id_: string | undefined, authorId_: string | undefined, responseToId_: string | undefined, text_: string, sentAt: Date,
      chunks_: Array<IRelevantEnrichedChunk>);

   /**
    * Create a Message object
    * @param message - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(message: Message);

   public constructor(...arr: any[]) {

      super();

      if (arr.length === 0) {
         this._id = keyGenerator.generateKey(); // An new Message has a key
         this._authorId = "";                       // But not an author
         this._responseToId = undefined;
         this._text = "";
         this._sentAt = new Date();
         this._chunks = new Array<IRelevantEnrichedChunk>();
         this._tokens = 0;
         this._isTokenCacheDirty = true;
         this._isStreaming = false;
         this._streamHandler = undefined;
         return;
      }

      var localId: string;
      var localAuthorId: string;
      var localResponseToId: string;
      var localText: string;
      var localSentAt: Date;
      var localChunks: Array<IRelevantEnrichedChunk>;

      if (arr.length === 1) {
         localId = arr[0]._id
         localAuthorId = arr[0]._authorId;
         localResponseToId = arr[0]._responseToId;
         localText = arr[0]._text;
         localSentAt = new Date(arr[0]._sentAt);
         localChunks = arr[0]._chunks;
      }
      else if (arr.length === 5) {
         localId = arr[0];
         localAuthorId = arr[1];
         localResponseToId = arr[2];
         localText = arr[3];
         localSentAt = new Date(arr[4]);
         localChunks = new Array<IRelevantEnrichedChunk>();
      }
      else {
         localId = arr[0];
         localAuthorId = arr[1];
         localResponseToId = arr[2];
         localText = arr[3];
         localSentAt = new Date(arr[4]);
         localChunks = arr[5];
      }

      if (!Message.isValidId(localId)) {
         throw new InvalidParameterError("Id:" + localId + '.');
      }

      this._id = localId;
      this._authorId = localAuthorId;
      this._responseToId = localResponseToId;
      this._text = localText;
      this._sentAt = localSentAt;
      this._chunks = localChunks;
      this._tokens = 0;
      this._isTokenCacheDirty = true;
      this._isStreaming = false;
      this._streamHandler = undefined;
   }

   /**
    * Dynamic creation for Streaming framework
    */
   dynamicClassName(): string {

      return className;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new Message();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(className, Message.createDynamicInstance);
   streamOut(): string {

      return JSON.stringify({
         id: this._id, authorId: this._authorId,
         responseToId: this._responseToId,
         text: this._text, sentAt: this._sentAt,
         chunks: this._chunks,
         tokens: this._tokens,
         isStreaming: this._isStreaming
      });
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      let chunks = new Array<IRelevantEnrichedChunk>();
      let objChunks = obj.chunks;

      if (objChunks) {
         for (let i = 0; i < objChunks.length; i++) {
            let newSource = objChunks[i];
            chunks.push(newSource);
         }
      }
      this.assign(new Message(obj.id, obj.authorId, obj.responseToId, obj.text, new Date(obj.sentAt), chunks));

      this._isTokenCacheDirty = true;

      if (obj.tokens && obj.tokens !== 0) {
         this._tokens = obj.tokens;
         this._isTokenCacheDirty = false;
      }

      // This is for backwards compatibility - the 'streaming' concept was introduced after
      // the set of Fluid containers were set up, so it is not stored on many messages. 
      // So we have to check if the attribute exists
      if (typeof obj.isStreaming === "undefined")
         this._isStreaming = false;
      else
         this._isStreaming = obj.isStreaming;
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): string {
      return this._id;
   }
   get authorId(): string {
      return this._authorId;
   }
   get responseToId(): string | undefined {
      return this._responseToId;
   }
   get text(): string {
      return this._text;
   }
   get sentAt(): Date {
      return this._sentAt;
   }
   get chunks(): Array<IRelevantEnrichedChunk> {
      return this._chunks;
   }
   get isDirty(): boolean {
      return this._isTokenCacheDirty;
   }
   get tokens(): number {
      if (this._isTokenCacheDirty) {
         let estimatedTokens = tokenizer.estimateTokenCount(this._text);

         if (this._chunks) {
            for (let i = 0; i < this._chunks.length; i++) {
               estimatedTokens += tokenizer.estimateTokenCount(this._chunks[i].chunk.summary);
            }
         }
         this._tokens = estimatedTokens;
         this._isTokenCacheDirty = false;
      }
      return this._tokens;
   }
   get checkedResponseToId(): string {
      throwIfUndefined(this._responseToId);
      return this._responseToId;
   }
   get isStreaming(): boolean {
      return this._isStreaming;
   }

   /**
   * set of 'setters' for private variables
   */
   set id(id_: string) {
      if (!Message.isValidId(id_)) {
         throw new InvalidParameterError("Id:" + id_ + '.');
      }

      this._id = id_;
   }

   set authorId(authorId_: string) {

      this._authorId = authorId_;
   }

   set text(text_: string) {

      this._text = text_;
      this._isTokenCacheDirty = true;
   }

   set responseToId(responseToId_: string) {

      this._responseToId = responseToId_;
   }

   set sentAt(sentAt_: Date) {

      this._sentAt = new Date(sentAt_);
   }

   set chunks(chunks_: Array<IRelevantEnrichedChunk>) {
      this._chunks = chunks_;
      this._isTokenCacheDirty = true;
   }
   set isStreaming(isStreaming: boolean) {

      this._isStreaming = isStreaming;
   }

   /**
    * is this message unprompted i.e. not a reply.  
    */
   isUnPrompted(): boolean {
      return (typeof (this._responseToId) === "undefined");
   }

   /**
    * force token calculation
    */
   calculateTokens(): number {

      return this.tokens;
   }

   /**
    * Use this when live streaming text from server into a message
    */
   hookLiveAppend(handler: MessageStreamingHandler): void {

      this._isStreaming = true;
      this._streamHandler = handler;
   }

   /**
    * Use this when live streaming text from server into a message
    */
   unhookLiveAppend(): void {

      this._isStreaming = false;
      this._streamHandler = undefined;
   }

   /**
    * Use this when live streaming text from server into a message
    */
   liveUpdateText(text: string, more: boolean): string {

      this.text = text;

      if (this._streamHandler) {
         this._streamHandler(this, more);
      }

      return this.text;
   }

   /**
     * Use this when live streaming chunks from server into a message
     */
   liveUpdateChunks(chunks: Array<IRelevantEnrichedChunk>, more: boolean): string {

      this._chunks = chunks;

      if (this._streamHandler) {
         this._streamHandler(this, more);
      }

      return this.text;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Message): boolean {

      return ((this._id === rhs._id) &&
         (this._authorId === rhs._authorId) &&
         ((this._responseToId === undefined && rhs._responseToId === undefined) || (this._responseToId === rhs._responseToId)) &&
         (this._text === rhs._text) &&
         (areSameDate(this._sentAt, rhs._sentAt)) &&
         areSameDeepArray(this._chunks, rhs._chunks));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Message): Message {
      this._id = rhs._id;
      this._authorId = rhs._authorId;
      this._responseToId = rhs._responseToId;
      this._text = rhs._text;
      this._sentAt = new Date(rhs._sentAt);
      this._chunks = rhs._chunks;
      this._tokens = 0;
      this._isTokenCacheDirty = true;
      this._isStreaming = false;

      return this;
   }

   /**
    * test for valid id 
    * @param id - the string to test
    */
   static isValidId(id_: string): boolean {
      if (!id_) // undefined keys are allowed if user object has not been originated from or saved anywhere persistent
         return true;

      if (id_ && id_.length > 0) // if the id exists, must be > zero length
         return true;

      return (false);
   }
}
