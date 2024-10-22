// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Studio API

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
   url: string | undefined;
   summary: string;   
   icon: string | undefined;
}

