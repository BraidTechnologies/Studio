'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally

/**
 * @module GenerateQuestion
 * @description Azure Function module that provides a method for generating a question based on a summary.
 * This module handles the generation of a question based on a summary,
 * and returns it in a structured format. It includes validation for session authentication
 * and error handling for any issues encountered during the request processing.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { IQuestionGenerationResponse, IGenerateQuestionQuery} from "../../../CommonTs/src/EnrichedQuery";
import { IModelConversationPrompt } from "../../../CommonTs/src/IModelDriver";
import { isSessionValid, sessionFailResponse, defaultErrorResponse} from "./Utility.Azure";
import { getDefaultChatModelDriver } from "../../../CommonTs/src/IModelFactory";
import { EPromptPersona } from "../../../CommonTs/src/IPromptPersona";

async function askModel(query: IGenerateQuestionQuery): Promise<IQuestionGenerationResponse> {

   let modelDriver = getDefaultChatModelDriver();
   let prompt : IModelConversationPrompt = {
      history: [],
      prompt: query.summary
   }

   let response = await modelDriver.generateResponse (EPromptPersona.kDeveloperQuestionGenerator, prompt, {wordTarget: query.wordTarget});

   const queryResponse: IQuestionGenerationResponse = {
      question: response.content
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

