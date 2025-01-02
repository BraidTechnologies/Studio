// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module Keys
 * @description Provides classes for managing keys in the Boxer application.
 * 
 * This module includes the SessionKey and ConversationKey classes which handle:
 * - Creating and validating keys
 * - Converting keys to strings
 */

import { IKeyGenerator } from './IKeyGenerator';
import { getDefaultKeyGenerator } from './IKeyGeneratorFactory';

export class SessionKey {

   private _sessionId: string;

   /**
    * Create a SessionKey object. A join key is a GUID - this class just makes a type wrapper round a string. 
    */
   constructor(trialInput_: string) {

      this._sessionId = trialInput_;      
   }   
   
   /**
   * Does this look like a valid UUID
   */
   looksValidSessionKey(): boolean {
      let keyGenerator : IKeyGenerator = getDefaultKeyGenerator();

      return keyGenerator.couldBeAKey (this._sessionId);
   }

   /**
    * Return a string representation
    */
   toString(): string {
      return this._sessionId;
   }   
}

export class ConversationKey {

   private _conversationId: string;

   /**
    * Create a ConversationKey object. A ConversationKey is a GUID - this class just makes a type wrapper round a string. 
    */
   constructor(trialInput_: string) {

      this._conversationId = trialInput_;      
   }   
   
   /**
   * Does this look like a valid UUID
   */
   looksValidConversationKey(): boolean {

      let keyGenerator : IKeyGenerator = getDefaultKeyGenerator();

      return keyGenerator.couldBeAKey (this._conversationId);
   }

   /**
    * Return a string representation
    */
   toString(): string {
      return this._conversationId;
   }    
   
}

