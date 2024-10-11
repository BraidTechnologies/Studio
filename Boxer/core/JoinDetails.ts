// Copyright (c) 2024 Braid Technologies Ltd
import { EConfigStrings } from "./ConfigStrings";
import { SessionKey, ConversationKey } from "./Keys";

import { getDefaultFluidEnvironment } from "../../BraidCommon/src/IEnvironmentFactory";
import { EEnvironment } from "../../BraidCommon/src/IEnvironment";

var qs = require('qs');

function validateEmail(email_: string) : boolean {
   if (!email_)
      return false;

   const res = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
   return res.test(String(email_).toLowerCase());
 }

export class JoinDetails {

   private _email: string;
   private _name: string;
   private _session: SessionKey;
   private _conversation: ConversationKey;  
   private _secret: string; 

   /**
    * Create a JoinDetails object. A join details is in the format 'email=xxx@yyy.com&session=guid&conversation=guid' . The email is used to uniquely identify the joiner, the session 
    * specifies a key to use for basic security, conversation is a Fluid UUID
    * It can be valid with a string that looks like an email address, and a session and conversation keys that look like UUIDs
    */
   constructor(trialInput_: string) {
   
      this._session = new SessionKey("");
      this._conversation = new ConversationKey("");      
      this._email = "";
      this._name = "";
      this._secret = "";

      let parsed = qs.parse (trialInput_); 

      this._email = parsed.email ? parsed.email : "";
      this._name = parsed.name ? parsed.name: "";
      this._session = parsed.session ? new SessionKey (parsed.session) : new SessionKey ("");
      this._conversation = parsed.conversation ? new ConversationKey (parsed.conversation) : new ConversationKey ("");  
      this._secret = parsed.secret ? parsed.secret : "";        
   }   
   
   /**
   * set of 'getters' for private variables
   */
   get email(): string  {
      return this._email;
   }
   get name(): string  {
      return this._name;
   }   
   get session(): SessionKey  {
      return this._session;
   }
   get conversation(): ConversationKey  {
      return this._conversation;
   }   
   get secret(): string  {
      return this._secret;
   }     
   toString(): string  {
      return JoinDetails.toString (this._email, this._name, this._session, this._conversation, this._secret);
   }

   canAttemptJoin(): boolean {
      let environment = getDefaultFluidEnvironment();

      // If we are running locally, allow empty conversation key -> this creates a new conversation
      if ((environment.name === EEnvironment.kLocal) && this._conversation.toString().length === 0)
         return this._session.looksValidSessionKey() && validateEmail (this._email);

      return (this._session.looksValidSessionKey() 
         && this._conversation.looksValidConversationKey() 
         && validateEmail (this._email));          
   } 

   static toString (email_: string, name_: string, session_: SessionKey, conversation_: ConversationKey, secret_: string) : string {
      return '&' + EConfigStrings.kEmailParamName + '=' +  email_ 
         + '&' + EConfigStrings.kNameParamName + '=' +  name_ 
         + '&' + EConfigStrings.kSessionParamName + '=' + session_.toString() 
         + '&' + EConfigStrings.kConversationParamName + '=' + conversation_.toString()
         + '&' + EConfigStrings.kSecretParamName + '=' + secret_.toString();
   }

   static makeFromParts (email_: string, name_: string, session_: SessionKey, conversation_: ConversationKey, secret_: string) {

      return new JoinDetails (JoinDetails.toString (email_, name_, session_, conversation_, secret_));
   }
  
}