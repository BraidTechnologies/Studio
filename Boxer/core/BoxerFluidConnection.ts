// Copyright (c) 2024 Braid Technologies Ltd

import { SharedMap } from "fluid-framework/legacy";
import { Persona } from './Persona';
import { Message } from './Message';
import { SharedEmbedding } from "./SharedEmbedding";
import { FluidConnection } from './FluidConnection';
import { CaucusOf } from './CaucusFramework';
import { throwIfUndefined } from './Asserts'; 
import { EConfigStrings } from "./ConfigStrings";
import { EIcon } from "./Icons";

const containerSchema = {
   initialObjects: {
      participantMap: SharedMap,
      messageMap: SharedMap,
      sharedEmbeddingMap: SharedMap,
      configuration: SharedMap
   }
};

// MessageBotFluidConnection - concrete derived class of FluidConnection
// connects the fluid connection to two local caucuses - one for participants, another for messages
export class BraidFluidConnection extends FluidConnection {

   _initialObjects: any;
   _localUser: Persona;
   _participantCaucus: CaucusOf<Persona> | undefined;
   _messageCaucus: CaucusOf<Message> | undefined;
   _sharedEmbeddingCaucus: CaucusOf<SharedEmbedding> | undefined;
   _interval: NodeJS.Timeout | undefined;

   constructor(localUser_: Persona) {

      super();

      this._initialObjects = undefined;
      this._participantCaucus = undefined;
      this._messageCaucus = undefined;   
      this._sharedEmbeddingCaucus = undefined;
      this._localUser = localUser_; 
      this._interval = undefined;
   }

   schema() : any {
      return containerSchema;
   }

   // This menas the list of Messages is ordered by send time ascending
   compareFn (a: Message, b: Message) : number {
      return a.sentAt.getTime() - b.sentAt.getTime();
   }

   setupLocalCaucuses (initialObjects_: any) : void {

      this._initialObjects = initialObjects_;

      // Create caucuses so they exist when observers are notified of connection
      this._participantCaucus = new CaucusOf<Persona>(initialObjects_.participantMap as SharedMap);
      this._messageCaucus = new CaucusOf<Message>(initialObjects_.messageMap as SharedMap, this.compareFn);  
      this._sharedEmbeddingCaucus = new CaucusOf<SharedEmbedding> (initialObjects_.sharedEmbeddingMap as SharedMap)
      
      this.setInitialValues(this._participantCaucus, this._messageCaucus);

      let self = this;

      this._interval = setInterval(() => {
         throwIfUndefined(self._participantCaucus);
         throwIfUndefined(self._messageCaucus);         
         checkAddAddSelfToAudience(self._participantCaucus, self._messageCaucus, self._localUser);
       }, 10000);
   }

   disconnectLocalCaucuses () : void {
      clearInterval (this._interval);
   }

   participantCaucus(): CaucusOf<Persona> {
      throwIfUndefined (this._participantCaucus);
      return this._participantCaucus;
   }

   messageCaucus(): CaucusOf<Message> {
      throwIfUndefined (this._messageCaucus);
      return this._messageCaucus;
   }    

   sharedEmbeddingCaucus(): CaucusOf<SharedEmbedding> {
      throwIfUndefined (this._sharedEmbeddingCaucus);
      return this._sharedEmbeddingCaucus;
   } 

   resetMessages () : void {

      throwIfUndefined (this._messageCaucus);      
      this._messageCaucus.removeAll ();    
      
      throwIfUndefined (this._participantCaucus);  
      this._participantCaucus.removeAll ();

      throwIfUndefined (this._sharedEmbeddingCaucus);  
      this._sharedEmbeddingCaucus.removeAll ();      

      this.setInitialValues (this._participantCaucus, 
                             this._messageCaucus);
   }

   private setInitialValues (participantCaucus: CaucusOf<Persona>,  
                             messageCaucus: CaucusOf<Message>): void {
    
      checkAddAddSelfToAudience (participantCaucus, messageCaucus, this._localUser);

      // Add the Bot persona if its not already there
      let isStored = participantCaucus.has(EConfigStrings.kLLMGuid);

      if (! isStored ) {

         let botPersona = new Persona (EConfigStrings.kLLMGuid, EConfigStrings.kLLMName, EConfigStrings.kLLMName, EIcon.kLLMPersona, undefined, new Date());
         participantCaucus.add (botPersona.id, botPersona);            
      }
   } 
}

function checkAddAddSelfToAudience (participantCaucus: CaucusOf<Persona>, 
   messageCaucus: CaucusOf<Message>,
   localUser: Persona): void {

   let isStored = participantCaucus.has(localUser.id);

   if (! isStored ) {      
      
      // We look at all participants looking for someine with the same email as us. 
      // If we find one, we do a 'glare' comparison to consistently pick a winner, and the loser of the
      // 'glare' comparison sets their details to those of the winner. 
      let currentParticipants = participantCaucus.currentAsArray();
      let found = false;

      for (let i = 0; i < currentParticipants.length && !found; i++) {        
         if ((localUser.email === currentParticipants[i].email ) && 
             (localUser.name === currentParticipants[i].name )) { 
            
            found = true;
            localUser.id = currentParticipants[i].id; // Need to push the new ID back into our local copy
         }
      }

      if (!found) {
         // Connect our own user ID to the participant caucus if we are not already in it (or our email is)
         participantCaucus.add (localUser.id, localUser);             
      }
   } 
   else {
      // Check the right name is stored - name changes when the user logs in 
      let stored = participantCaucus.get(localUser.id);         
      if ((stored.name !== localUser.name) || (stored.email !== localUser.email)) {
         participantCaucus.add (localUser.id, localUser);                 
      }        
   }
}   

