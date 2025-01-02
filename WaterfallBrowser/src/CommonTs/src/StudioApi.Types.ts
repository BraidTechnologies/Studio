// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Studio API
/**
 * @module StudioApi.Types
 * @description Defines the data types and interfaces used by the Studio API.
 * 
 * This module contains the interfaces that define the structure of:
 * - Studio boxer requests and responses
 * - Enrichment data structures for studio responses
 * 
 * These types support the StudioApi module in providing type-safe
 * interactions with the Studio API endpoints.
 */

/**
 * Interface for the StudioBoxer request object.
 */
export interface IStudioBoxerRequest {

   question: string;
}

/**
 * Interface for the IStudioBoxerResponseEnrichment response object.
 */
export interface IStudioBoxerResponseEnrichment {

   id: string,
   summary: string;    
   title: string | undefined;
   url: string | undefined;  
   iconUrl: string | undefined;
}

