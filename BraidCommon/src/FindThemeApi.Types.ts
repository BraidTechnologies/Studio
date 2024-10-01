// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Embed API

/**
 * Interface for the find theme request object.
 */
export interface IFindThemeRequest{

   text: string;
   length: number;
}

/**
 * Interface for the find theme response object.
 */
export interface IFindThemeResponse {

   theme: string;
}