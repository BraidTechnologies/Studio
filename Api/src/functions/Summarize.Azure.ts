'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally
/**
 * @module Summarize.Azure
 * 
 * This module provides the Azure Functions implementation of the text summarization API.
 * It handles HTTP requests for text summarization, validates sessions, and processes
 * requests through the core summarization functionality.
 * 
 * Key features:
 * - Exposes HTTP endpoint for text summarization requests
 * - Validates session tokens and request parameters
 * - Processes requests through the core Summarize module
 * - Returns summarized text or appropriate error responses
 * 
 * Dependencies:
 * - @azure/functions for Azure Functions runtime
 * - ./Summarize for core summarization logic
 * - ./Utility for session validation and error responses
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { isSessionValid, sessionFailResponse, defaultErrorResponse, invalidRequestResponse } from "./Utility.Azure";
import { ISummariseRequest, ISummariseContextRequest, ISummariseResponse } from "../../../CommonTs/src/SummariseApi.Types";
import { recursiveSummarize } from "./Summarize";


/**
 * Asynchronous function to summarize text based on the requested session key and input text.
 * 
 * @param request - The HTTP request object containing the text to be summarized.
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the summarized text or an error message.
 */
export async function summarize(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let words: number = 50;
   let overallSummary: string | undefined = undefined;
   let minimumTextLength: number = 64;

   if (isSessionValid(request, context)) {

      try {
         const jsonRequest = await request.json();
         context.log(jsonRequest);

         const summariseSpec = (jsonRequest as any).request as ISummariseRequest;

         text = summariseSpec.text;
         words = summariseSpec.lengthInWords ? Math.floor(Number(summariseSpec.lengthInWords)) : 50;
         const persona = summariseSpec.persona;

         if (text && text.length >= minimumTextLength && words > 0) {
            const definitelyText: string = text;
            overallSummary = await recursiveSummarize(persona, definitelyText, 0, words);

            const summariseResponse: ISummariseResponse = {
               summary: overallSummary
            }

            context.log(summariseResponse);

            return {
               status: 200, // Ok
               body: JSON.stringify(summariseResponse)
            };
         }
         else {
            context.error("Text is below minimum length or invalid length for summary.");
            return invalidRequestResponse("Text is below minimum length or invalid length for summary.")
         }
      }
      catch (e: any) {
         context.error(e);
         return defaultErrorResponse();
      }
   }
   else {
      context.error("Session validation failed.");
      return sessionFailResponse();
   }
};

/**
 * Asynchronous function to summarize text based on the requested session key and input text.
 * 
 * @param request - The HTTP request object containing the text to be summarized.
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the summarized text or an error message.
 */
export async function summarizeContext (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let words: number = 50;
   let overallSummary: string | undefined = undefined;
   let minimumTextLength: number = 64;

   if (isSessionValid(request, context)) {

      try {
         const jsonRequest = await request.json();
         context.log(jsonRequest);

         const summariseSpec = (jsonRequest as any).request as ISummariseContextRequest;

         text = summariseSpec.context;
         words = summariseSpec.lengthInWords ? Math.floor(Number(summariseSpec.lengthInWords)) : 50;
         const persona = summariseSpec.persona;

         if (text && text.length >= minimumTextLength && words > 0) {
            const definitelyText: string = text;
            overallSummary = await recursiveSummarize(persona, definitelyText, 0, words);

            const summariseResponse: ISummariseResponse = {
               summary: overallSummary
            }

            context.log(summariseResponse);

            return {
               status: 200, // Ok
               body: JSON.stringify(summariseResponse)
            };
         }
         else {
            context.error("Text is below minimum length or invalid length for summary.");
            return invalidRequestResponse("Text is below minimum length or invalid length for summary.")
         }
      }
      catch (e: any) {
         context.error(e);
         return defaultErrorResponse();
      }
   }
   else {
      context.error("Session validation failed.");
      return sessionFailResponse();
   }
};

let fullPrompt = `<document>\n${context}\n</document>\nHere is the chunk we want to situate within the whole document:\n<chunk>\n${chunk}\n</chunk>\n` +
'Please give a short succinct context to situate this chunk within the overall document for the purppose of improving sarch retrieval of the chunk.' +
'Answer only with the succinct contxt and nothing else.';


app.http('Summarize', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: summarize
});

app.http('SummarizeContext', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: summarizeContext
});

