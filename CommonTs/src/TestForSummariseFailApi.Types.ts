// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the SuppressSummariseFail API
/**
 * @module TestForSummariseFailApi.Types
 * @description Defines the data types and interfaces used by the TestForSummariseFail API.
 * 
 * This module contains the interfaces that define the structure of:
 * - Test requests for summary validation
 * - Response types indicating summary validation status
 * - Enumeration of possible validation results
 * 
 * These types support the TestForSummariseFailApi module in providing type-safe
 * validation of generated summaries.
 */

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