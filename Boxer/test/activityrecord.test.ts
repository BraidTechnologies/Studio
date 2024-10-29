'use strict';
// Copyright Braid technologies ltd, 2024
import { MDynamicStreamable } from '../core/StreamingFramework';
import { ActivityRecord} from '../core/ActivityRecord';
import { UrlActivityRecord } from '../core/ActivityRecordUrl';
import { MessageActivityRecord } from '../core/ActivityRecordMessage';
import { LikeUnlikeActivityRecord } from '../core/ActivityRecordLikeUnlike';
import { SessionKey } from '../core/Keys';
import { getRecordRepository } from '../core/IActivityRepositoryFactory';
import { getDefaultKeyGenerator } from '../core/IKeyGeneratorFactory';

import { expect } from 'expect';
import { describe, it } from 'mocha';
import { throwIfUndefined } from '../core/Asserts';

const keyGenerator = getDefaultKeyGenerator();

var myId: string = "1234";
var myConversationId = "1234;"
var myEmail: string = "Jon";
var myHappenedAt = ActivityRecord.makeDateUTC (new Date());

var someoneElsesId: string = "5678";
var someoneElsesConversationId = "1234;"
var someoneElsesEmail: string = "Barry";
var someoneElsesHappenedAt = ActivityRecord.makeDateUTC (new Date());

describe("ActivityRecord", function () {

   var activity1: ActivityRecord, activity2: ActivityRecord, activityErr:ActivityRecord;

   activity1 = new ActivityRecord(myId, myConversationId, myEmail, myHappenedAt);

   activity2 = new ActivityRecord(someoneElsesId, someoneElsesConversationId, someoneElsesEmail, someoneElsesHappenedAt);

   it("Needs to construct an empty object", function () {

      var activityEmpty = new ActivityRecord();

      expect(activityEmpty.userId).toEqual("");     
   });

   it("Needs to allow undefined ID", function () {

      var caught: boolean = false;
      try {
         var activityErr: ActivityRecord = new ActivityRecord(undefined, myConversationId, myId, myHappenedAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(false);
   });

   it("Needs to detect invalid ID", function () {

      var caught: boolean = false;
      try {
         var activityErr: ActivityRecord = new ActivityRecord(1 as unknown as string, myConversationId, myId, myHappenedAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });

   it("Needs to detect invalid conversation ID", function () {

      var caught: boolean = false;
      try {
         var activityErr: ActivityRecord = new ActivityRecord(myId, 1 as unknown as string, myId, myHappenedAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });

   it("Needs to detect invalid name", function () {

      var caught: boolean = false;
      try {
         var activityErr: ActivityRecord = new ActivityRecord(myId, myConversationId, undefined as unknown as string, myHappenedAt);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });


   it("Needs to compare for equality and inequality", function () {

      var activityNew: ActivityRecord = new ActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created);

      expect(activity1.equals(activity1)).toEqual(true);
      expect(activity1.equals(activityNew)).toEqual(true);
      expect(activity1.equals(activity2)).toEqual(false);
   });
   
   it("Needs to detect inequality on date", function () {

      var activityNew: ActivityRecord = new ActivityRecord(activity1.id, activity1.contextId, activity1.userId, new Date());

      expect(activity1.equals(activityNew)).toEqual(false);
   });

   it("Needs to correctly store attributes", function () {
         
      expect(activity1.userId === myEmail).toEqual(true);
      expect(activity1.created.getTime() === myHappenedAt.getTime()).toEqual(true);
   });

   it("Needs to copy construct", function () {

      let activity2: ActivityRecord = new ActivityRecord(activity1);

      expect(activity1.equals(activity2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      var activityNew: ActivityRecord = new ActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created);

      activityNew.id = someoneElsesId;
      activityNew.userId = someoneElsesEmail;
      activityNew.created = ActivityRecord.makeDateUTC (someoneElsesHappenedAt);

      expect(activity2.equals (activityNew)).toEqual(true);
   });

   it("Needs to catch errors on change id attributes", function () {

      var caught: boolean = false;
      try {
         activity1.id = 1 as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);

   });

   it("Needs to throw errors on change name attribute", function () {

      var caught: boolean = false;
      try {
         activity1.userId = undefined as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);

   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = activity1.streamOut();

      var activityNew: ActivityRecord = new ActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created);
      activityNew.streamIn(stream);

      expect(activity1.equals(activityNew)).toEqual(true);
   });

   it("Needs to dynamically create ActivityRecord to and from JSON()", function () {

      var stream: string = activity1.flatten();

      var activityNew: ActivityRecord = new ActivityRecord();

      expect(activity1.equals(activityNew)).toEqual(false);

      activityNew = MDynamicStreamable.resurrect(stream) as ActivityRecord;

      expect(activity1.equals(activityNew)).toEqual(true);
   });

});

var myUrl: string = "url";
var someoneElsesUrl: string = "Barry";

describe("UrlActivityRecord", function () {

   var activity1: UrlActivityRecord, activity2: UrlActivityRecord, activityErr:UrlActivityRecord;

   activity1 = new UrlActivityRecord(myId, myConversationId, myEmail, myHappenedAt, myUrl);

   activity2 = new UrlActivityRecord(someoneElsesId, someoneElsesConversationId, someoneElsesEmail, someoneElsesHappenedAt, someoneElsesUrl);

   it("Needs to construct an empty object", function () {

      var activityEmpty = new UrlActivityRecord();

      expect(activityEmpty.url).toEqual("");     
   });


   it("Needs to detect invalid url", function () {

      var caught: boolean = false;
      try {
         var activityErr: UrlActivityRecord = new UrlActivityRecord(myId, myConversationId, myEmail, myHappenedAt, undefined as unknown as string);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });


   it("Needs to compare for equality and inequality", function () {

      var activityNew: UrlActivityRecord = new UrlActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.url);

      expect(activity1.equals(activity1)).toEqual(true);
      expect(activity1.equals(activityNew)).toEqual(true);
      expect(activity1.equals(activity2)).toEqual(false);
   });


   it("Needs to correctly store attributes", function () {
         
      expect(activity1.url === myUrl).toEqual(true);
   });

   it("Needs to copy construct", function () {

      let activity2: UrlActivityRecord = new UrlActivityRecord(activity1);

      expect(activity1.equals(activity2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      var activityNew: UrlActivityRecord = new UrlActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.url);

      activityNew.id = someoneElsesId;
      activityNew.userId = someoneElsesEmail;
      activityNew.created = someoneElsesHappenedAt;
      activityNew.url = someoneElsesUrl;      

      expect(activity2.equals (activityNew)).toEqual(true);
   });

   it("Needs to throw errors on change url attribute", function () {

      var caught: boolean = false;
      try {
         activity1.url = undefined as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);

   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = activity1.streamOut();

      var activityNew: UrlActivityRecord = new UrlActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.url);
      activityNew.streamIn(stream);

      expect(activity1.equals(activityNew)).toEqual(true);
   });

   it("Needs to dynamically create ActivityRecord to and from JSON()", function () {

      var stream: string = activity1.flatten();

      var activityNew: UrlActivityRecord = new UrlActivityRecord();

      expect(activity1.equals(activityNew)).toEqual(false);

      activityNew = MDynamicStreamable.resurrect(stream) as UrlActivityRecord;

      expect(activity1.equals(activityNew)).toEqual(true);
   });
});

describe("LikeDislikeActivityRecord", function () {

   var activity1: LikeUnlikeActivityRecord, activity2: LikeUnlikeActivityRecord, activityErr:LikeUnlikeActivityRecord;

   activity1 = new LikeUnlikeActivityRecord(myId, myConversationId, myEmail, myHappenedAt, myUrl, true);

   activity2 = new LikeUnlikeActivityRecord(someoneElsesId, someoneElsesConversationId, someoneElsesEmail, someoneElsesHappenedAt, someoneElsesUrl, true);

   it("Needs to construct an empty object", function () {

      var activityEmpty = new LikeUnlikeActivityRecord();

      expect(activityEmpty.url).toEqual("");  
      expect(activityEmpty.like).toEqual(true);         
   });


   it("Needs to detect invalid url", function () {

      var caught: boolean = false;
      try {
         let activityErr = new LikeUnlikeActivityRecord(myId, myConversationId, myEmail, myHappenedAt, undefined as unknown as string, true);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });


   it("Needs to compare for equality and inequality", function () {

      let activityNew = new LikeUnlikeActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.url, true);

      expect(activity1.equals(activity1)).toEqual(true);
      expect(activity1.equals(activityNew)).toEqual(true);
      expect(activity1.equals(activity2)).toEqual(false);
   });


   it("Needs to correctly store attributes", function () {
         
      expect(activity1.url === myUrl).toEqual(true);
      expect(activity1.like).toEqual(true);      
   });

   it("Needs to copy construct", function () {

      let activity2 = new LikeUnlikeActivityRecord(activity1);

      expect(activity1.equals(activity2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      let activityNew = new LikeUnlikeActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.url, true);

      activityNew.id = someoneElsesId;
      activityNew.userId = someoneElsesEmail;
      activityNew.created = someoneElsesHappenedAt;
      activityNew.url = someoneElsesUrl;      
      activityNew.like = true;

      expect(activity2.equals (activityNew)).toEqual(true);
   });

   it("Needs to throw errors on change url attribute", function () {

      var caught: boolean = false;
      try {
         activity1.url = undefined as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);

   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = activity1.streamOut();

      let activityNew = new LikeUnlikeActivityRecord (activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.url, activity1.like);
      activityNew.streamIn(stream);

      expect(activity1.equals(activityNew)).toEqual(true);
   });

   it("Needs to dynamically create ActivityRecord to and from JSON()", function () {

      let stream = activity1.flatten();

      let activityNew = new LikeUnlikeActivityRecord();

      expect(activity1.equals(activityNew)).toEqual(false);

      activityNew = MDynamicStreamable.resurrect(stream) as LikeUnlikeActivityRecord;

      expect(activity1.equals(activityNew)).toEqual(true);
   });
});

var myMessage: string = "message";
var someoneElsesMessage: string = "other message";

describe("MessageActivityRecord", function () {

   var activity1: MessageActivityRecord, activity2: MessageActivityRecord, activityErr:MessageActivityRecord;

   activity1 = new MessageActivityRecord(myId, myConversationId, myEmail, myHappenedAt, myMessage);

   activity2 = new MessageActivityRecord(someoneElsesId, someoneElsesConversationId, someoneElsesEmail, someoneElsesHappenedAt, someoneElsesMessage);

   it("Needs to construct an empty object", function () {

      var activityEmpty = new MessageActivityRecord();

      expect(activityEmpty.message).toEqual("");     
   });


   it("Needs to detect invalid message", function () {

      var caught: boolean = false;
      try {
         var activityErr: MessageActivityRecord = new MessageActivityRecord(myId, myConversationId, myEmail, myHappenedAt, undefined as unknown as string);
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);
   });


   it("Needs to compare for equality and inequality", function () {

      var activityNew: MessageActivityRecord = new MessageActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.message);

      expect(activity1.equals(activity1)).toEqual(true);
      expect(activity1.equals(activityNew)).toEqual(true);
      expect(activity1.equals(activity2)).toEqual(false);
   });


   it("Needs to correctly store attributes", function () {
         
      expect(activity1.message === myMessage).toEqual(true);
   });

   it("Needs to copy construct", function () {

      let activity2: MessageActivityRecord = new MessageActivityRecord(activity1);

      expect(activity1.equals(activity2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      var activityNew: MessageActivityRecord = new MessageActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.message);

      activityNew.id = someoneElsesId;
      activityNew.userId = someoneElsesEmail;
      activityNew.created = someoneElsesHappenedAt;
      activityNew.message = someoneElsesMessage;      

      expect(activity2.equals (activityNew)).toEqual(true);
   });

   it("Needs to throw errors on change message attribute", function () {

      var caught: boolean = false;
      try {
         activity1.message = undefined as unknown as string;
      } catch (e) {
         caught = true;
      }
      expect(caught).toEqual(true);

   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = activity1.streamOut();

      var activityNew: MessageActivityRecord = new MessageActivityRecord(activity1.id, activity1.contextId, activity1.userId, activity1.created, activity1.message);
      activityNew.streamIn(stream);

      expect(activity1.equals(activityNew)).toEqual(true);
   });

   it("Needs to dynamically create ActivityRecord to and from JSON()", function () {

      var stream: string = activity1.flatten();

      var activityNew: MessageActivityRecord = new MessageActivityRecord();

      expect(activity1.equals(activityNew)).toEqual(false);

      activityNew = MDynamicStreamable.resurrect(stream) as MessageActivityRecord;

      expect(activity1.equals(activityNew)).toEqual(true);
   });

});

describe("ActivityRepository", function () {

   this.timeout(10000);

   beforeEach(async () => {

      this.timeout(10000);
   });
      
   let sessionKey = process.env.SessionKey;
   throwIfUndefined (sessionKey);
   let repository = getRecordRepository(new SessionKey (sessionKey));

   it("Needs to save a URL record", async function () {

      var activity = new UrlActivityRecord(keyGenerator.generateKey(), "madeupconversationKey", 
                                 "jonathanverrier@hotmail.com", new Date(), 
                                 "https://test.cosmos");

      let saved = await repository.save (activity);

      expect(saved).toEqual(true);     
   });

   it("Needs to save a LikeDislike record", async function () {

      var activity = new LikeUnlikeActivityRecord (keyGenerator.generateKey(), "madeupconversationKey", 
                                 "jonathanverrier@hotmail.com", new Date(), 
                                 "https://test.cosmos", true);

      let saved = await repository.save (activity);

      expect(saved).toEqual(true);     
   });   

   it("Needs to save a Message record", async function () {

      var activity = new MessageActivityRecord (keyGenerator.generateKey(), "madeupconversationKey", 
                                 "jonathanverrier@hotmail.com", new Date(), 
                                 "Test message");

      let saved = await repository.save (activity);

      expect(saved).toEqual(true);     
   });   

   it("Needs to load a record", async function () {

      var activity = new LikeUnlikeActivityRecord (keyGenerator.generateKey(), "madeupconversationKey", 
                                 "jonathanverrier@hotmail.com", new Date(), 
                                 "https://test.cosmos", true);

      let saved = await repository.save (activity);      
      let loaded = await repository.loadRecentUrlActivity (3);

      expect(loaded.length > 0).toEqual(true);     
   });  

   it("Needs to remove a Message record", async function () {

      let messageId = keyGenerator.generateKey();
      var activity = new MessageActivityRecord (messageId, "madeupconversationKey", 
                                 "jonathanverrier@hotmail.com", new Date(), 
                                 "Test message");

      let saved = await repository.save (activity);

      let removed = await repository.removeMessageRecord (messageId);

      expect(removed).toEqual(true);     
   }); 
});

