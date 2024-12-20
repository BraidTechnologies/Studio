// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the FindTheme API
/**
 * @module ThemeApi
 * @description Provides interfaces and types for theme detection and analysis.
 * 
 * This module contains the interfaces that define the structure of:
 * - Theme detection requests and responses
 * - Criteria for finding themes in text
 * 
 * These types support theme-related operations by providing type-safe
 * structures for analyzing and identifying thematic elements in content.
 */

/**
 * Interface for specifying the criteria to find a theme.
 * @interface
 */
export interface IFindThemeRequest{

   text: string;
   length : number;
}

