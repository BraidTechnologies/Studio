// Copyright (c) 2024 Braid Technologies Ltd
import axios from "axios";

// Local
import { SessionKey } from "./Keys";
import { logApiError } from "./Logging";
import { EConfigStrings } from "./ConfigStrings";
import { EConfigNumbers } from "./ConfigStrings";
import { ISummariseRequest, ISummariseResponse} from "../../Braid/BraidCommon/src/SummariseApi.Types"


export async function makeSummaryCall (session: SessionKey, text: string) : Promise<string | undefined> {

   let summary: string | undefined = undefined;
   let apiUrl: string = EConfigStrings.kSummariseUrl;
   
   apiUrl = apiUrl + '?session=' + session.toString();
   let request: ISummariseRequest = {
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