'use strict';
// Copyright Braid Technologies Ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import { getEnvironment} from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { ISummariseRequest, ISummariseContextRequest, ISummariseResponse } from "../../CommonTs/src/SummariseApi.Types";
import { SummariseApi } from '../../CommonTs/src/SummariseApi';
import { EPromptPersona } from '../../CommonTs/src/IPromptPersona';

declare var process: any;

describe("Summarise", async function () {

   async function validSummaryCall (apiUrl: string, text: string) : Promise<string | undefined> {

      let summary: string | undefined = undefined;
      let summariseRequest: ISummariseRequest = {
         persona: EPromptPersona.kArticleSummariser,
         text: text,
         lengthInWords: 50
      }

      try {
         let response = await axios.post(apiUrl, {
           request: summariseRequest,
           headers: {
              'Content-Type': 'application/json'
           }
         });

         summary = (response.data as ISummariseResponse).summary;
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return summary;
   }

   async function invalidSummaryCall (apiUrl: string, text: string) : Promise <Boolean> {
   
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

      let sampleText : string | undefined = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.summariseApi() + "?session=" + "thiswillfail";

      let caught = await invalidSummaryCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to fail if session key is incorrect against production", async function () {

      let sampleText : string | undefined = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.summariseApi() + "?session=" + "thiswillfail";

      let caught = await invalidSummaryCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to summarise a simple message", async function () {

      let sampleText = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);

   
   it("Needs to summarise a long message", async function () {

      let baseText = "My name is Jon and I am founding an AI project acceleration company." ;  
      let sampleText = baseText;  
      for (var i = 0; i < 1000; i++)  {
         sampleText = sampleText + " " + baseText;
      }

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);   

   
   it("Needs to summarise a simple message against production", async function () {

      let sampleText = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);

   it("Needs to summarise a long message against production", async function () {

      let baseText = "My name is Jon and I am founding an AI project acceleration company." ;  
      let sampleText = baseText;  
      for (var i = 0; i < 500; i++)  {
         sampleText = sampleText + " " + baseText;
      }

      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(10000);    

   it("Needs to summarise context for chunk", async function () {

      let api = new SummariseApi(getEnvironment(EEnvironment.kLocal), process.env.BRAID_SESSION_KEY.toString());

      let context = "The highly anticipated championship game between the Riverside Ravens and Metro Knights lived up to all expectations. The Ravens started strong, with their star forward James Chen scoring 15 points in the first quarter. The Knights struggled early but mounted a comeback in the second quarter behind veteran guard Sarah Williams' precise three-point shooting. The momentum shifted back and forth throughout a tense third quarter, with neither team able to build more than a five-point lead. The fourth quarter was a defensive battle, with both teams making crucial stops. With just 30 seconds remaining and the Ravens up by one, Knights center Marcus Thompson blocked what looked like an easy layup. On the final possession, Williams drove the lane and dished to Thompson who slammed home the game-winning dunk with 0.3 seconds left. The Knights' bench erupted in celebration as they secured their first championship title in franchise history with a thrilling 98-97 victory. Thompson finished with 22 points and 15 rebounds while Williams contributed 28 points and 8 assists in the historic win.";
      
      let chunk = "The Knights struggled early but mounted a comeback in the second quarter behind veteran guard Sarah Williams' precise three-point shooting.";
      
      let contextSummary = await api.summariseContext (context, chunk);

      console.log (contextSummary);

      expect (contextSummary && contextSummary?.summary.length > 0).toBe (true) ;     
   }).timeout(10000);

});