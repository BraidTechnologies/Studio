'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { sessionFailResponse, defaultErrorResponse, isSessionValid, invalidRequestResponse } from "./Utility";

import { IFindThemeRequest, IFindThemeResponse } from "../../../CommonTs/src/FindThemeApi.Types";
import { throwIfUndefined } from "../../../CommonTs/src/Asserts";

let minimumTextLength = 64;

/**
 * Asynchronous function to find a common theme from a number of paragraphs of text.
 * Makes a POST request to an Azure endpoint to get the most common theme in the provided text.
 * Utilizes axios for HTTP requests and axiosRetry for up to 5 retries in case of rate limit errors.
 * @param text The text containing paragraphs to analyze for a common theme.
 * @param length The length for the theme text to return.
 * @returns A Promise that resolves to the most common theme found in the text.
 */
async function findThemeCall(text: string, length: number): Promise<string> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   let response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: [
         {
            role: 'system',
            content: "You are an AI asistant that finds a common theme from a number of pararaphs of text in "
               + length.toString() + " words or less. Please find the most common theme in the following text in "
               + length.toString() + " words. Do not start your reply with the phrase 'The most common theme in the text is'. Translate to English if necessary. "
         },
         {
            role: 'user',
            content: text
         }
      ],
   },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   return (response.data.choices[0].message.content);
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
         let jsonRequest = await request.json();
         context.log(jsonRequest);
         let themeSpec = (jsonRequest as any).request as IFindThemeRequest;                                        

         text = themeSpec.text;
         length = themeSpec.length;

         if (text && text.length >= minimumTextLength && length > 0) {

            let definitelyText: string = text;
            let definitelyLength: number = length ? length : defaultLength;
            theme = await findThemeCall(definitelyText, definitelyLength);

            throwIfUndefined (theme);
            let themeResponse : IFindThemeResponse = {
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

