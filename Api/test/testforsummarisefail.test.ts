'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { ITestForSummariseFailRequest, ITestForSummariseFailResponse, ETestForSummariseFail } from "../../CommonTs/src/TestForSummariseFailApi.Types";

declare var process: any;

let summariseFails = ["Im sorry, but it seems that the text you provided does not contain any main body information. It consists of web page navigation and cookie details. Please provide a different text for summarization.",
  "The given text is not the main body of the page and does not contain any relevant information for summarizing. It appears to be a website navigation menu and does not provide any meaningful content to summarize.",
  "There is no relevant information to summarise as the text appears to be a website navigation menu and includes irrelevant information such as contact information and other web page elements.",
  "Im sorry, but I cannot summarize the given text as the relevant information is not clear. It seems to be a mixture of web page navigation items, company descriptions, and consent form options for selecting cookies on a website. Please provide a specific body of text that you woild like me to summarise.",
  "I apologize for the inconvenience, but it appears that the text provided is not suitable for generating a meaningful summary. It contains irrelevant information or is incomplete. If you can provide a more specific and complete text, I would be happy to assist you in summasising other content.",
  "There is no main body of text.",
  "I apologize for the inconvenience, but there is no main body of text, I cannot provide a summary."]

describe("TestForSummariseFail", async function () {

   async function validCall (apiUrl: string, text: string, length: number) : Promise<string | undefined> {

      let failCode: string | undefined = undefined;
      let summariseRequest: ITestForSummariseFailRequest = {
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

         failCode = (response.data as ITestForSummariseFailResponse).isValidSummary;
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return failCode;
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

      let apiUrl = environment.testForSummariseFail() + "?session=" + "thiswillfail";

      let caught = await invalidCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to suppress example fails", async function () {

      for (let i = 0; i < summariseFails.length; i++) {   
         let sampleText = summariseFails[i];

         let environment = getEnvironment(EEnvironment.kLocal);
  
         let apiUrl = environment.testForSummariseFail() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

         let failCode = await validCall (apiUrl, sampleText, 10);

         expect (failCode && failCode?.length > 0).toBe (true) ;  
         expect (failCode).toBe (ETestForSummariseFail.kSummaryFailed.toString()) ;           
      }   

   }).timeout(20000);

   it("Needs to fail if session key is incorrect", async function () {

      let sampleText : string | undefined = summariseFails[0] ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.testForSummariseFail() + "?session=" + "thiswillfail";

      let caught = await invalidCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to suppress example fails against production", async function () {

      for (let i = 0; i < summariseFails.length; i++) {   
         let sampleText = summariseFails[i];

         let environment = getEnvironment(EEnvironment.kProduction);
  
         let apiUrl = environment.testForSummariseFail() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

         let failCode = await validCall (apiUrl, sampleText, 10);

         expect (failCode && failCode?.length > 0).toBe (true) ;  
         let noValue = ETestForSummariseFail.kSummaryFailed;     
         expect (failCode == noValue).toBe (true) ;           
      }   

   }).timeout(20000);

});