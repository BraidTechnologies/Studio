// Copyright (c) 2024 Braid Technologies Ltd
import { SessionKey, ConversationKey } from "./Keys";
import { JoinDetails } from "./JoinDetails";
import { getDefaultKeyGenerator } from "./IKeyGeneratorFactory";

export class JoinPageValidator {

   /**
    * Create an empty JoinPageValidator object 
    */
   constructor() {
   }   

   // Looks at the name and keys provided, and returns true if the data looks ready to join a conversation, else false.
   canAttemptJoin  (email_: string, name_: string, session_: SessionKey, conversation_: ConversationKey) : boolean {

      let details = JoinDetails.makeFromParts (email_, name_, session_, conversation_, "");    

      return details.canAttemptJoin();
   }

   // Looks at the secret returns true if the secret matches the one stored, else false.
   matchesSavedSecret  (secret_: string) : boolean {

      let keyGenerator = getDefaultKeyGenerator();

      return keyGenerator.matchesSavedSecret (secret_);
   }   

   haveSavedSecret  () : boolean {

      let keyGenerator = getDefaultKeyGenerator();

      return keyGenerator.haveSavedSecret ();
   }     

   savedSecret  () : string {

      let keyGenerator = getDefaultKeyGenerator();

      return keyGenerator.savedSecret ();
   }     
}