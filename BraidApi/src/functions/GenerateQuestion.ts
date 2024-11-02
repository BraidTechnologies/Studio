'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { EConversationRole, IConversationElement,IQuestionGenerationResponse, IGenerateQuestionQuery} from "../../../BraidCommon/src/EnrichedQuery";

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

   let systemPromptElement: IConversationElement = { role: EConversationRole.kSystem, content: query.personaPrompt };
   let questionElement: IConversationElement = { role: EConversationRole.kUser, content: query.questionGenerationPrompt + " " + query.summary};

   let fullPrompt: Array<IConversationElement> = new Array<IConversationElement>();
   fullPrompt.push(systemPromptElement);
   fullPrompt.push(questionElement);

   let directPromise = axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
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

   let question = (directResponse.data.choices[0].message.content);

   let queryResponse: IQuestionGenerationResponse = {
      question: question
   }

   return queryResponse;
}


export async function generateQuestion(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {
         let jsonRequest = await request.json();
                  
         let query = (jsonRequest as any)?.data as IGenerateQuestionQuery;

         context.log (query);
         let response = await askModel(query);
         let responseText = JSON.stringify(response);
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

