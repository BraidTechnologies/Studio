/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * This function handles the HTTP request and returns the boxer information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the boxer information.
 */
export async function boxer(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
    jsonBody: {
      results: [],
    },
  };

  // Get the question query parameter.
  const question = req.query.get("question");

  let item = 
  {
   id: "3",
   title: "Tire service",
   description: "Rotate and replace tires, moving them from one position to another on the vehicle to ensure even wear and removing worn tires and installing new ones.",
   image: "https://th.bing.com/th/id/OIP.N64J4jmqmnbQc5dHvTm-QAHaE8?pid=ImgDet&rs=1",
   url: "https://th.bing.com/th/id/OIP.N64J4jmqmnbQc5dHvTm-QAHaE8?pid=ImgDet&rs=1"   
 };

 let items  = new Array();
 items.push (item);

  // Return filtered boxer records, or an empty array if no records were found.
  res.jsonBody.results = items;
  return res;
}

app.http("boxer", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: boxer,
});
