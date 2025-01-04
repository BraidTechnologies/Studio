// Copyright Braid Technologies Ltd, 2024
/**
 * @module Classify
 * @description Azure Function that provides text classification services using AI.
 * This module handles the classification of text into predefined subject areas
 * using OpenAI's API. It includes functionality for session validation, error handling,
 * and response formatting.
 * 
 * The classification process uses a single-shot approach where the AI model
 * categorizes the input text into one of the provided classification categories.
 * 
 * @copyright Braid Technologies Ltd, 2024
 */

'use strict';
// 'func azure functionapp publish Braid-Api to publish to Azure
// 'func start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isSessionValid, sessionFailResponse, defaultErrorResponse, invalidRequestResponse } from "./Utility.Azure";
import { IClassifyRequest, IClassifyResponse } from "../../../CommonTs/src/ClassifyApi.Types";
import { IModelConversationPrompt } from "../../../CommonTs/src/IModelDriver";
import { getDefaultChatModelDriver } from "../../../CommonTs/src/IModelFactory";
import { EPromptPersona } from "../../../CommonTs/src/IPromptPersona";

/**
 * Decodes the initial classification string to a human-readable format.
 * 
 * @param initial - The initial classification string to decode.
 * @returns The decoded classification in a human-readable format, or "Unknown" if not found.
 */
function decodeClassification(initial: string, classifications: Array<string>): string {

   for (let i = 0; i < classifications.length; i++) {
      if (initial.includes(classifications[i])) {
         if (classifications[i] === "CurrentAffairs")
            return "Current Affairs";
         return classifications[i];
      }
   }

   return "Unknown";
}

/**
 * Asynchronously classifies the given text into one of the predefined subject areas using an AI assistant.
 * 
 * @param text The text to be classified.
 * @returns A Promise that resolves to a string representing the classification result.
 */
async function singleShotClassify(text: string, classifications: Array<string>): Promise<string> {

   let modelDriver = getDefaultChatModelDriver();
   
   let prompt : IModelConversationPrompt = {
      history: [],
      prompt: text
   }

   let response = await modelDriver.generateResponse (EPromptPersona.kClassifier, prompt, {promptParam1: classifications.join(",")});

   const decoded = decodeClassification(response.content, classifications);

   return (decoded);
}


/**
 * Handles the classification of text based on the provided session key and text content.
 * 
 * @param request - The HTTP request object containing the query parameters and JSON data.
 * @param context - The invocation context for logging and other context-specific operations.
 * @returns A Promise that resolves to an HTTP response with the classification result or an error message.
 */
export async function classify(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let classifications: Array<string> | undefined = undefined;

   if (isSessionValid(request, context)) {
      try {
         const jsonRequest = await request.json();
         context.log (jsonRequest);
         
         const spec = (jsonRequest as any).request as IClassifyRequest;
         text = spec.text;
         classifications = spec.classifications;

         if ((text && text.length > 0)
         && (classifications && classifications.length > 0)) {

            const summaryClassification = await singleShotClassify(text, classifications);

            const classificationResponse : IClassifyResponse = {
               classification: summaryClassification
            }
            
            context.log (classificationResponse);

            return {
               status: 200, // Ok
               body: JSON.stringify(classificationResponse)
            };
         }
         else {
            context.error ("Error classifying text: Text or classifications not provided.");
            return invalidRequestResponse("Text or classifications not provided.");
         }
      }
      catch (e: any) {
         context.error ("Error classifying text:", e);
         return defaultErrorResponse();
      }
   }
   else {
      context.error ("Session validation failed.");         
      return sessionFailResponse();
   }
};

app.http('Classify', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: classify
});
