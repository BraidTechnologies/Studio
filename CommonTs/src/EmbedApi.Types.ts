// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Embed API

import { EPromptPersona } from "./IPromptPersona";

/**
 * Interface for the embedding request object.
 */
export interface IEmbedRequest{

   persona: EPromptPersona;
   text: string;
}

/**
 * Interface for the embedding response object.
 */
export interface IEmbedResponse {

   embedding: Array<number>;
}