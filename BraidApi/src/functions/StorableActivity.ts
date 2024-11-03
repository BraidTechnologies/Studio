'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { activityStorableAttributes } from "./CosmosStorableApi";
import { getStorableApi as getStorableApi, removeStorableApi, saveStorableApi, getRecentStorablesApi } from "./AzureStorableApi";

app.http('GetActivity', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: getActivity
});

/**
 * Saves an activity record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the activity.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the activity data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function getActivity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   
   return getStorableApi (request, activityStorableAttributes, context);
};

app.http('SaveActivity', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: saveActivity
});

/**
 * Saves an activity record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the activity.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the activity data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function saveActivity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   
   return saveStorableApi (request, activityStorableAttributes, context);
};

app.http('RemoveActivity', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: removeActivity
});

/**
 * Asynchronously removes an activity using the provided HTTP request and invocation context.
 * 
 * @param request - The HTTP request containing the activity information.
 * @param context - The context in which the activity removal is taking place.
 * @returns A promise that resolves to an HttpResponseInit object representing the removal operation result.
 */
export async function removeActivity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   return removeStorableApi (request, activityStorableAttributes, context);
}

app.http('GetActivities', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: getRecentActivities
});

export async function getRecentActivities(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   return getRecentStorablesApi (request, activityStorableAttributes, context);
}

