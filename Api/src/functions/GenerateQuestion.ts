'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

/**
 * @module GenerateQuestion
 * @description Azure Function module that provides a method for generating a question based on a summary.
 * This module handles the generation of a question based on a summary,
 * and returns it in a structured format. It includes validation for session authentication
 * and error handling for any issues encountered during the request processing.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { EConversationRole, IConversationElement,IQuestionGenerationResponse, IGenerateQuestionQuery} from "../../../CommonTs/src/EnrichedQuery";

import { isSessionValid, sessionFailResponse, defaultErrorResponse} from "./Utility";

async function askModel(query: IGenerateQuestionQuery): Promise<IQuestionGenerationResponse> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   const systemPromptElement: IConversationElement = { role: EConversationRole.kSystem, content: query.personaPrompt };
   const questionElement: IConversationElement = { role: EConversationRole.kUser, content: query.questionGenerationPrompt + " " + query.summary};

   const fullPrompt: Array<IConversationElement> = new Array<IConversationElement>();
   fullPrompt.push(systemPromptElement);
   fullPrompt.push(questionElement);

   const directPromise = axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: fullPrompt,
   },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   const directResponse = await directPromise;

   const question = (directResponse.data.choices[0].message.content);

   const queryResponse: IQuestionGenerationResponse = {
      question: question
   }

   return queryResponse;
}


export async function generateQuestion(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {
         const jsonRequest = await request.json();
                  
         const query = (jsonRequest as any)?.data as IGenerateQuestionQuery;

         context.log (query);
         const response = await askModel(query);
         const responseText = JSON.stringify(response);
         context.log (responseText);

         return {
            status: 200, // Ok
            body: responseText
         };
      }
      catch (e: any) {
         context.error (e);
         return defaultErrorResponse();
      }
   }
   else {
      return sessionFailResponse();
   }
};

app.http('GenerateQuestion', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: generateQuestion
});

