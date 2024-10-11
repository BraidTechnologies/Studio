'use strict';
// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { SessionKey } from '../core/Keys';
import { Persona } from '../core/Persona';
import { BraidFluidConnection } from '../core/BoxerFluidConnection';
import { throwIfUndefined } from '../core/Asserts';

describe("Make new container", function () {
 

   it("Needs to create new container", async function () {
     
      let local = Persona.unknown();

      let fluidMessagesConnection = new BraidFluidConnection(local);

      throwIfUndefined(process.env.SessionKey);
      fluidMessagesConnection.createNew (new SessionKey (process.env.SessionKey), true).then (conversationKey_ => {
        
         console.log ("Created conversation:" + conversationKey_);

      }).catch ((e : any) => {
      
         console.error ("Error creating conversation:" + e.toString());
      })

      expect (true).toBe (true);
   });         
});

