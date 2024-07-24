import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';

let maxChunkSize = 1024*3;
let minimumTextLength = 256;

/**
 * Splits the input text into chunks of maximum size defined by 'maxChunkSize'.
 * 
 * @param text The text to be chunked.
 * @returns An array of strings, each representing a chunk of the input text.
 */
function chunkText (text: string) : Array<string> {
   
   let chunks = new Array<string> ();

   for (var chunked = 0; chunked < text.length; chunked += maxChunkSize) {
      chunks.push (text.substring (chunked, chunked + maxChunkSize))
   }

   return chunks;
}

/**
 * Asynchronously summarizes the given text using an AI assistant.
 * 
 * @param text The text to be summarized.
 * @returns A Promise that resolves to the summarized text.
 */
async function SingleShotSummarize (text: string) : Promise <string> {

   let response = await axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
      messages: [
         {
            role: 'system',
            content: "You are an AI asistant that summarises text in 50 words or less. Please summarise the following text in 50 words. Translate to English if necessary. "
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

async function RecursiveSummarize (text: string, level: number) : Promise <string> {

   let overallSummary : string | undefined = undefined; 
   let chunks = chunkText (text);
   let summaries = new Array<string> ();

   console.log ("Recursive summarise level:" + level.toString());

    // If the text was > threshold, we break it into chunks.
    // Here we look over each chunk to generate a summary for each
    for (var i = 0; i < chunks.length; i++) {
    
       let summary = await SingleShotSummarize (chunks[i]);
       summaries.push (summary);          
    }  
 
    // If we made multiple summaries, we resummarise them
    if (chunks.length > 1) {
       let joinedSummaries = summaries.join (" ");
      overallSummary = await RecursiveSummarize (joinedSummaries, level + 1);
    }
    else {
      overallSummary = summaries[0];
    }  
    
    return overallSummary;
}

/**
 * Asynchronous function to summarize text based on the requested session key and input text.
 * 
 * @param request - The HTTP request object containing the text to be summarized.
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the summarized text or an error message.
 */
export async function Summarize(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let requestedSession : string | undefined = undefined;     
    let text : string | undefined = undefined;   
    let overallSummary : string | undefined = undefined; 

    for (const [key, value] of request.query.entries()) {
        if (key === 'session')
            requestedSession = value;                
    }

    let jsonRequest = await request.json();     

    if ((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) {  

      text = (jsonRequest as any)?.data?.text;

      if (!text || text.length < minimumTextLength) {
         overallSummary = "Sorry, not enough text to summarise."
      }
      else {

         let definitelyText: string = text;
         overallSummary = await RecursiveSummarize (definitelyText, 0);         
       }
       context.log("Passed session key validation:" + requestedSession);     

       return {
          status: 200, // Ok
          body: overallSummary
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

app.http('summarize', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Summarize
});

