'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally

/**
 * @module FindTheme
 * @description Azure Function module that provides a method for finding a common theme from a number of paragraphs of text.
 * This module handles the retrieval of a common theme from a number of paragraphs of text,
 * and returns it in a structured format. It includes validation for session authentication
 * and error handling for any issues encountered during the request processing.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { sessionFailResponse, defaultErrorResponse, isSessionValid, invalidRequestResponse } from "./Utility.Azure";

import { IFindThemeRequest, IFindThemeResponse } from "../../../CommonTs/src/FindThemeApi.Types";
import { throwIfUndefined } from "../../../CommonTs/src/Asserts";
import { IModelConversationPrompt } from "../../../CommonTs/src/IModelDriver";
import { getDefaultChatModelDriver } from "../../../CommonTs/src/IModelFactory";
import { EPromptPersona } from "../../../CommonTs/src/IPromptPersona";

const minimumTextLength = 64;

/**
 * Asynchronous function to find a common theme from a number of paragraphs of text.
 * Makes a POST request to an Azure endpoint to get the most common theme in the provided text.
 * Utilizes axios for HTTP requests and axiosRetry for up to 5 retries in case of rate limit errors.
 * @param text The text containing paragraphs to analyze for a common theme.
 * @param length The length for the theme text to return.
 * @returns A Promise that resolves to the most common theme found in the text.
 */
async function findThemeCall(text: string, length: number): Promise<string> {

   let modelDriver = getDefaultChatModelDriver();
   
   let prompt : IModelConversationPrompt = {
      history: [],
      prompt: text
   }

   let response = await modelDriver.generateResponse (EPromptPersona.kThemeFinder, prompt, {wordTarget: length});

   return (response.content);
}

/**
 * Finds a theme from the provided text based on certain criteria.
 * Validates the session key and returns an HTTP response with the theme summary or an authorization error message.
 * @param request - The HTTP request containing the text and session key.
 * @param context - The invocation context for logging and validation.
 * @returns A promise of an HTTP response with the theme summary or an authorization error message.
 */
export async function findTheme(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let length: number | undefined = undefined;
   let theme: string | undefined = undefined;
   const defaultLength = 15;

   if (isSessionValid(request, context)) {
      
      try {
         const jsonRequest = await request.json();
         context.log(jsonRequest);
         const themeSpec = (jsonRequest as any).request as IFindThemeRequest;                                        

         text = themeSpec.text;
         length = themeSpec.length;

         if (text && text.length >= minimumTextLength && length > 0) {

            const definitelyText: string = text;
            const definitelyLength: number = length ? length : defaultLength;
            theme = await findThemeCall(definitelyText, definitelyLength);

            throwIfUndefined (theme);
            const themeResponse : IFindThemeResponse = {
               theme: theme
            }
            context.log (themeResponse);

            return {
               status: 200, // Ok
               body: JSON.stringify (themeResponse)
            };      
         }
         else {
            context.error ("Text is below minimum length or invalid length for theme.");            
            return invalidRequestResponse ("Text is below minimum length or invalid length for theme.")
         }
      }
      catch (e: any) {
         context.error (e);
         return defaultErrorResponse();
      }      
   }
   else {
      context.error ("Session validation failed.");         
      return sessionFailResponse();
   }
};

app.http('FindTheme', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: findTheme
});

