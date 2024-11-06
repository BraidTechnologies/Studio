// Copyright (c) 2024 Braid Technologies Ltd

/**
 * Logs a core error with the provided description and details.
 * 
 * @param description - A brief description of the core error.
 * @param details - Additional details related to the core error.
 * @returns void
 */
export function logCoreError (description: string, details: any) : void {

   console.error ("Core error:" + description + "Details:" + details.toString());
}

/**
 * Logs a database error with the provided description and details.
 * 
 * @param description - A brief description of the error.
 * @param details - Additional details about the error.
 * @returns void
 */
export function logDbError (description: string, details: any) : void {

   console.error ("Database error:" + description + "Details:" + details.toString());
}

/**
 * Logs an API error with the provided description and details.
 * 
 * @param description A brief description of the API error.
 * @param details Additional details related to the API error.
 * @returns void
 */
export function logApiError (description: string, details: any) : void {

   console.error ("Api error:" + description + "Details:" + details.toString());
}

/**
 * Logs API information.
 * 
 * @param description - A brief description of the API information.
 * @param details - Additional details about the API information.
 * @returns void
 */
export function logApiInfo (description: string, details: any) : void {

   console.log ("Api Info:" + description + "Details:" + details.toString());
}