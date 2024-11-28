// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the SuppressSummariseFail API

/**
 * Defines the structure of a summarise request object.
 */
export interface ISuppressSummariseFailRequest{

   text: string;
   lengthInWords?: number | undefined;
}

export enum ESuppressSummariseFail {
   kYes = "Yes",
   kNo = "No"
}

/**
 * Defines the structure of a summarise response object.
 */
export interface ISuppressSummariseFailResponse {

   isValidSummary: ESuppressSummariseFail;
}