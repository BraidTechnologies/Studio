/**
 * @module Logging
 * @description Provides logging functionality for different parts of the application.
 *
 * This module contains utility functions for logging errors and information across
 * different domains of the application, including:
 * - Core system errors
 * - Database errors
 * - API errors and information
 *
 * Each logging function follows a consistent pattern of accepting a description
 * and details parameter, formatting them appropriately for the logging context.
 * The module helps maintain consistent logging practices across the application
 * while differentiating between error domains for easier debugging.
 */
/**
 * Logs a core error with the provided description and details.
 *
 * @param description - A brief description of the core error.
 * @param details - Additional details related to the core error.
 * @returns void
 */
export declare function logCoreError(description: string, details: any): void;
/**
 * Logs a database error with the provided description and details.
 *
 * @param description - A brief description of the error.
 * @param details - Additional details about the error.
 * @returns void
 */
export declare function logDbError(description: string, details: any): void;
/**
 * Logs an API error with the provided description and details.
 *
 * @param description A brief description of the API error.
 * @param details Additional details related to the API error.
 * @returns void
 */
export declare function logApiError(description: string, details: any): void;
/**
 * Logs API information.
 *
 * @param description - A brief description of the API information.
 * @param details - Additional details about the API information.
 * @returns void
 */
export declare function logApiInfo(description: string, details: any): void;
//# sourceMappingURL=Logging.d.ts.map