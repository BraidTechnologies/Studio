'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { IClassifyRequest, IClassifyResponse } from '../../CommonTs/src/ClassifyApi.Types';

declare var process: any;

describe("Classify", async function () {

   async function validClassifyCall(apiUrl: string, text: string): Promise<string | undefined> {

      let classifications = ["Business", "Technology", "Politics", "Health", "Sport"];
      let classificationRequest: IClassifyRequest = {
         text: text,
         classifications: classifications
      };
      let classificationResponse: IClassifyResponse | undefined = undefined;


      try {
         let response = await axios.post(apiUrl, {
            request: classificationRequest,
            headers: {
               'Content-Type': 'application/json'
            }
         });

         classificationResponse = (response.data as IClassifyResponse);

      } catch (e: any) {

         console.error(e);
      }

      return classificationResponse?.classification;
   }

   async function invalidClassifyCall(apiUrl: string, text: string): Promise<Boolean> {

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

      let sampleText = "OpenAI have release a new large language model aimed at coding.";
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.classifyApi() + "?session=" + "thiswillfail";

      let caught = await invalidClassifyCall(apiUrl, sampleText);

      expect(caught).toBe(true);

   }).timeout(20000);


   it("Needs to fail if session key is incorrect against production", async function () {

      let sampleText = "OpenAI have released a new large language model aimed at coding.";
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.classifyApi() + "?session=" + "thiswillfail";

      let caught = await invalidClassifyCall(apiUrl, sampleText);

      expect(caught).toBe(true);

   }).timeout(20000);

   it("Needs to summarise a simple message against Production", async function () {

      let sampleText = "OpenAI have release a new large language model aimed at coding.";
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.classifyApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validClassifyCall(apiUrl, sampleText);

      expect(summary && summary?.length > 0).toBe(true);

   }).timeout(20000);

   it("Needs to summarise a simple message about Technology", async function () {

      let sampleText = "OpenAI have released a new large language model aimed at coding.";
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.classifyApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validClassifyCall(apiUrl, sampleText);

      expect(summary && summary?.length > 0).toBe(true);
      expect(summary?.includes("Technology")).toBe(true);

   }).timeout(20000);

   it("Needs to summarise a simple message about Business", async function () {

      let sampleText = "The Coca-cola company has made a take-over bid for Pepsi.";
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.classifyApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validClassifyCall(apiUrl, sampleText);

      expect(summary && summary?.length > 0).toBe(true);
      expect(summary?.includes("Business")).toBe(true);

   }).timeout(20000);

   it("Needs to summarise a simple message about Politics", async function () {

      let sampleText = "The President is heading to emergecy talks with the German chancellor.";
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.classifyApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validClassifyCall(apiUrl, sampleText);

      expect(summary && summary?.length > 0).toBe(true);
      expect(summary?.includes("Politics")).toBe(true);

   }).timeout(20000);

   it("Needs to summarise a simple message about Health", async function () {

      let sampleText = "Taking a small dose of aspirin each day has been shown to reduce the chances of heart desease.";
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.classifyApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let summary = await validClassifyCall(apiUrl, sampleText);

      expect(summary && summary?.length > 0).toBe(true);
      expect(summary?.includes("Health")).toBe(true);

   }).timeout(20000);

   /* 
    it("Needs to summarise a simple message against production", async function () {
 
       let sampleText = "OpenAI have release a new large language model aimed at coding." ;      
       let environment = getEnvironment(EEnvironment.kProduction);
 
       let apiUrl = environment.classifyApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();
 
       let summary = await validClassifyCall (apiUrl, sampleText);
 
       expect (summary && summary?.length > 0).toBe (true) ;     
 
    }).timeout(20000);
 */


});