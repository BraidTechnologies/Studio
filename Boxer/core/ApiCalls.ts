// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module ApiCalls
 * @description Provides functions for making API calls to the Braid backend.
 * 
 * This module includes functions for making summarization requests to the Summarise API,
 * as well as other utility functions for making API calls to other services.
 */

import axios from "axios";

// Local
import { SessionKey } from "./Keys";
import { logApiError } from "./Logging";
import { EConfigNumbers } from "./ConfigStrings";
import { getDefaultEnvironment } from "../../CommonTs/src/IEnvironmentFactory";
import { ISummariseRequest, ISummariseResponse} from "../../CommonTs/src/SummariseApi.Types"
import { EPromptPersona } from "../../CommonTs/src/IPromptPersona";


export async function makeSummaryCall (session: SessionKey, text: string) : Promise<string | undefined> {

   let summary: string | undefined = undefined;
   let env =  getDefaultEnvironment();
   let apiUrl = env.summariseApi() + '?session=' + session.toString();
   
   let request: ISummariseRequest = {
      persona: EPromptPersona.kDeveloperAssistant,
      text: text,
      lengthInWords: EConfigNumbers.kSummaryLengthWords
   };

   try {
      let response = await axios.post(apiUrl, {
        request: request,
        headers: {
           'Content-Type': 'application/json'
        }
      });

      summary = (response.data as ISummariseResponse).summary;

   } catch (e: any) {       

      logApiError ("Error calling Summarize API:", e);           
   }   
   
   return summary;
}