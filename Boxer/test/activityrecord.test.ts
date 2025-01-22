'use strict';
// Copyright Braid technologies ltd, 2024
import {  IStoredUrlActivity, IStoredLikeUrlActivity, IStoredMessageActivity, 
   urlActivityRecordClassName, urlLikeActivityRecordClassName, messageActivityRecordClassName,
   urlActivityRecordSchemaNumber, urlLikeActivityRecordSchemaNumber, messageActivityRecordSchemaNumber } from '../core/ActivityRecord';
import { EStorableApplicationIds } from '../../CommonTs/src/IStorable';
import { SessionKey } from '../core/Keys';
import { getRecordRepository } from '../core/IActivityRepositoryFactory';
import { getDefaultKeyGenerator } from '../core/IKeyGeneratorFactory';

import { expect } from 'expect';
import { describe, it } from 'mocha';
import { throwIfUndefined } from '../core/Asserts';

const keyGenerator = getDefaultKeyGenerator();

describe("ActivityRepository", function () {

   this.timeout(10000);

   beforeEach(async () => {

      this.timeout(10000);
   });
      
   let sessionKey = process.env.BRAID_SESSION_KEY;
   throwIfUndefined (sessionKey);
   let repository = getRecordRepository(new SessionKey (sessionKey));

   it("Needs to save a URL record", async function () {

      var activity : IStoredUrlActivity= {
         id : keyGenerator.generateKey(),
         applicationId: EStorableApplicationIds.kBoxer,
         contextId: "madeupconversationKey",
         userId: "madeupname@hotmail.com",
         created: new Date().toUTCString(),
         amended: new Date().toUTCString(),  
         functionalSearchKey: undefined,  
         className: urlActivityRecordClassName,
         schemaVersion: urlActivityRecordSchemaNumber, 
         url: "https://test.cosmos"
      };

      let saved = await repository.save (activity);

      expect(saved).toEqual(true);     
   });

   it("Needs to save a LikeDislike record", async function () {

      var activity : IStoredLikeUrlActivity= {
         id : keyGenerator.generateKey(),
         applicationId: EStorableApplicationIds.kBoxer,
         contextId: "madeupconversationKey",
         userId: "madeupname@hotmail.com",
         created: new Date().toUTCString(),
         amended: new Date().toUTCString(),  
         functionalSearchKey: undefined,  
         className: urlLikeActivityRecordClassName,
         schemaVersion: urlLikeActivityRecordSchemaNumber, 
         url: "https://test.cosmos",
         like: true
      };

      let saved = await repository.save (activity);

      expect(saved).toEqual(true);     
   });   

   it("Needs to save a Message record", async function () {

      let activity : IStoredMessageActivity = {
         id : keyGenerator.generateKey(), 
         applicationId: EStorableApplicationIds.kBoxer,
         contextId: "madeupconversationKey",
         userId: "madeupname@hotmail.com",
         created: new Date().toUTCString(),
         amended: new Date().toUTCString(),  
         functionalSearchKey: undefined,  
         className: messageActivityRecordClassName,
         schemaVersion: messageActivityRecordSchemaNumber, 
         message: "Test message"
      };
      let saved = await repository.save (activity);

      expect(saved).toEqual(true);     
   });   

   it("Needs to load a record", async function () {

      var activity : IStoredLikeUrlActivity= {
         id : keyGenerator.generateKey(),
         applicationId: EStorableApplicationIds.kBoxer,
         contextId: "madeupconversationKey",
         userId: "madeupname@hotmail.com",
         created: new Date().toUTCString(),
         amended: new Date().toUTCString(),  
         functionalSearchKey: undefined,  
         className: urlLikeActivityRecordClassName,
         schemaVersion: urlLikeActivityRecordSchemaNumber, 
         url: "https://test.cosmos",
         like: true
      };

      let saved = await repository.save (activity);      
      let loaded = await repository.loadRecentUrlActivity (3);

      expect(loaded.length > 0).toEqual(true);     
   });  

   it("Needs to remove a Message record", async function () {

      let messageId = keyGenerator.generateKey();
      let activity : IStoredMessageActivity = {
         id : messageId, 
         applicationId: EStorableApplicationIds.kBoxer,
         contextId: "madeupconversationKey",
         userId: "madeupname@hotmail.com",
         created: new Date().toUTCString(),
         amended: new Date().toUTCString(),  
         functionalSearchKey: undefined,  
         className: messageActivityRecordClassName,
         schemaVersion: messageActivityRecordSchemaNumber, 
         message: "Test message"
      };

      let saved = await repository.save (activity);

      let removed = await repository.removeMessageRecord (messageId);

      expect(removed).toEqual(true);     
   }); 
});

