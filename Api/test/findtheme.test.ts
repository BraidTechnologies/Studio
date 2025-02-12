'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';

declare var process: any;

let themedText = "Surfing is a surface water sport in which an individual, a surfer (or two in tandem surfing), uses a board to ride on the forward section, or face, of a moving wave of water, which usually carries the surfer towards the shore. Waves suitable for surfing are primarily found on ocean shores, but can also be found as standing waves in the open ocean, in lakes, in rivers in the form of a tidal bore, or in wave pools." 
+ "\n\n"
+ "The term surfing refers to a person riding a wave using a board, regardless of the stance. There are several types of boards. The Moche of Peru would often surf on reed craft, while the native peoples of the Pacific surfed waves on alaia, paipo, and other such water craft. Ancient cultures often surfed on their belly and knees, while the modern-day definition of surfing most often refers to a surfer riding a wave standing on a surfboard; this is also referred to as stand-up surfing."

import { IFindThemeRequest, IFindThemeResponse } from "../../CommonTs/src/FindThemeApi.Types";

describe("FindTheme", async function () {

   async function validThemeCall (apiUrl: string, text: string, length: number) : Promise<string | undefined> {

      let theme: string | undefined = undefined;
      let findThemeRequest: IFindThemeRequest = {
         text: text,
         length: length
      }

      try {
         let response = await axios.post(apiUrl, {
           request: findThemeRequest,
           headers: {
              'Content-Type': 'application/json'
           }
         });

         theme = (response.data as IFindThemeResponse).theme;
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return theme;
   }

   async function invalidThemeCall (apiUrl: string, text: string) : Promise <Boolean> {
   
      var response: any;
      let caught = false;

      try {
         response = await axios.get(apiUrl, {
         });

      } catch (e: any) {       
         caught = true;
      }     

      return caught;
   }   

   it("Needs to fail if session key is incorrect", async function () {

      let sampleText : string | undefined = themedText ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.findThemeApi() + "?session=" + "thiswillfail";

      let caught = await invalidThemeCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to find theme of a simple message", async function () {

      let sampleText = themedText ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.findThemeApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validThemeCall (apiUrl, sampleText, 10);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);

   
   it("Needs to fail if session key is incorrect against production", async function () {

      let sampleText : string | undefined = themedText;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.findThemeApi() + "?session=" + "thiswillfail";

      let caught = await invalidThemeCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);   
   
   it("Needs to find theme of a simple message against production", async function () {

      let sampleText = themedText;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.findThemeApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validThemeCall (apiUrl, sampleText, 10);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);

});