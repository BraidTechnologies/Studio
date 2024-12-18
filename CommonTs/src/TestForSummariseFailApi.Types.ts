// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the SuppressSummariseFail API

/**
 * Defines the structure of a summarise request object.
 */
export interface ITestForSummariseFailRequest{

   text: string;
   lengthInWords?: number | undefined;
}

export enum ETestForSummariseFail {
   kSummaryFailed = "SummaryFailed",
   kSummarySucceeded = "SummarySucceeded"
}

/**
 * Defines the structure of a summarise response object.
 */
export interface ITestForSummariseFailResponse {

   isValidSummary: ETestForSummariseFail;
}