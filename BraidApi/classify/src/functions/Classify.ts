import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';

let classifications = ["Business", "Technology", "Politics", "Health", "Lifesyle", "CurrentAffairs"];

/*
get_speaker_name = {
   "name": "get_speaker_name",
   "description": "Get the speaker names for the session.",
   "parameters": {
       "type": "object",
       "properties": {
           "speakers": {
               "type": "string",
               "description": "The speaker names.",
           }
       },
       "required": ["speaker_name"],
   },
}


openai_functions = [get_speaker_name]
*/

/**
 * Asynchronously classifies the given text into one of the predefined subject areas using an AI assistant.
 * 
 * @param text The text to be classified.
 * @returns A Promise that resolves to a string representing the classification result.
 */
async function SingleShotClassify (text: string) : Promise <string> {


   let response = await axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
      messages: [
         {
            role: 'system',
            content: "You are an AI asistant that can classify text into one of the following subjects: " 
            + classifications.join (" ") 
            + "try to classify the subject of the following text. The classification is a single word from the list " 
            + classifications.join (" ") 
            + ". If you cannot classify it well, answer 'Unknown'"
         },
         {
            role: 'user',
            content: text
         }
         ]
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
 * Handles the classification of text based on the provided session key and text content.
 * 
 * @param request - The HTTP request object containing the query parameters and JSON data.
 * @param context - The invocation context for logging and other context-specific operations.
 * @returns A Promise that resolves to an HTTP response with the classification result or an error message.
 */
export async function Classify (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let requestedSession : string | undefined = undefined;     
    let text : string | undefined = undefined;   

    for (const [key, value] of request.query.entries()) {
        if (key === 'session')
            requestedSession = value;                
    }

    let jsonRequest = await request.json();
    context.log(jsonRequest);      
    text = (jsonRequest as any)?.data?.text;

    if (((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) && (text && text.length > 0)) {  

       let summaryClassification = await SingleShotClassify (text);
       context.log("Passed session key validation:" + requestedSession);     

       return {
          status: 200, // Ok
          body: summaryClassification
       };         
    }
    else 
    {
        context.log("Failed session key validation:" + requestedSession);  

        return {
           status: 401, // Unauthorised
           body: "Authorization check failed."
        };             
    }
};

app.http('Classify', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Classify
});
