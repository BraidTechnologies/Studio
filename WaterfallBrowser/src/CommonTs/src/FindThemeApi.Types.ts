/**
 * Types and interfaces for the FindTheme API.
 * 
 * This module contains the type definitions for the request and response
 * objects used in the FindTheme API, which is responsible for analyzing
 * text content and identifying its primary theme.
 * 
 * @module FindThemeApi.Types
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd
// Definitions for the data elements of the FindTheme API

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