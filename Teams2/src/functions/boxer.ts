/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import repairRecords from "../repairsData.json";

/**
 * This function handles the HTTP request and returns the repair information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the repair information.
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

  // Get the assignedTo query parameter.
  const assignedTo = req.query.get("assignedTo");

  let item = { 
   id: "1",
   title: "Oil change",
   summary: "Need to drain the old engine oil and replace it with fresh oil to keep the engine lubricated and running smoothly.",
   assignedTo: "Karin Blair",
   date: "2023-05-23",
   imageUrl: "https://www.howmuchisit.org/wp-content/uploads/2011/01/oil-change.jpg"
  };
  let items = new Array();
  items.push (item);

  res.jsonBody.results = items;
  return res;
}

app.http("boxer", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: boxer,
});
