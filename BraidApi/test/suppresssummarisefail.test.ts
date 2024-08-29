'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';

declare var process: any;

let summariseFails = ["Im sorry, but it seems that the text you provided does not contain any main body information. It consists of web page navigation and cookie details. Please provide a different text for summarization.",
  "The given text is not the main body of the page and does not contain any relevant information for summarizing. It appears to be a website navigation menu and does not provide any meaningful content to summarize.",
  "There is no relevant information to summarise as the text appears to be a website navigation menu and includes irrelevant information such as contact information and other web page elements.",
  "Im sorry, but I cannot summarize the given text as the relevant information is not clear. It seems to be a mixture of web page navigation items, company descriptions, and consent form options for selecting cookies on a website. Please provide a specific body of text that you woild like me to summarise.",
  "I apologize for the inconvenience, but it appears that the text provided is not suitable for generating a meaningful summary. It contains irrelevant information or is incomplete. If you can provide a more specific and complete text, I would be happy to assist you in summasising other content."]

describe("SuppressSummariseFail", async function () {

   async function validCall (apiUrl: string, text: string, length: number) : Promise<string | undefined> {

      let summary: string | undefined = undefined;

      try {
         let response = await axios.post(apiUrl, {
           data: {
              text: text,
              length: length
           },
           headers: {
              'Content-Type': 'application/json'
           }
         });

         summary = (response.data as string);
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return summary;
   }

   async function invalidCall (apiUrl: string, text: string) : Promise <Boolean> {
   
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

      let sampleText : string | undefined = summariseFails[0] ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.suppressSummariseFail() + "?session=" + "thiswillfail";

      let caught = await invalidCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to suppress example fails", async function () {

      for (let i = 0; i < summariseFails.length; i++) {   
         let sampleText = summariseFails[i];

         let environment = getEnvironment(EEnvironment.kLocal);
  
         let apiUrl = environment.suppressSummariseFail() + "?session=" + process.env.SessionKey.toString();

         let summary = await validCall (apiUrl, sampleText, 10);

         expect (summary && summary?.length > 0).toBe (true) ;  
         expect (summary).toBe ("Yes") ;           
      }   

   }).timeout(20000);

   it("Needs to fail if session key is incorrect", async function () {

      let sampleText : string | undefined = summariseFails[0] ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.suppressSummariseFail() + "?session=" + "thiswillfail";

      let caught = await invalidCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to suppress example fails against production", async function () {

      for (let i = 0; i < summariseFails.length; i++) {   
         let sampleText = summariseFails[i];

         let environment = getEnvironment(EEnvironment.kProduction);
  
         let apiUrl = environment.suppressSummariseFail() + "?session=" + process.env.SessionKey.toString();

         let summary = await validCall (apiUrl, sampleText, 10);

         expect (summary && summary?.length > 0).toBe (true) ;  
         expect (summary).toBe ("Yes") ;           
      }   

   }).timeout(20000);

});