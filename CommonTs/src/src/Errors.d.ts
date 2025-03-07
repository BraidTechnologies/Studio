/**
 * Custom error classes for the Braid application.
 *
 * This module provides a collection of specialized error classes that extend the base Error class.
 * Each error type is designed to handle specific categories of errors that may occur within the
 * application, such as invalid parameters, connection issues, or environment-related problems.
 *
 * All error classes include:
 * - Proper prototype chain restoration for TypeScript
 * - Automatic error logging through logCoreError or logApiError
 * - Standardized error naming for stack traces
 *
 * @module Errors
 */
/**
 * Represents an error thrown when an invalid parameter is encountered.
 * @param {string} message - The error message describing the invalid parameter.
 */
export declare class InvalidParameterError extends Error {
    constructor(message?: string);
}
/**
 * Represents an error that occurs when an invalid operation is attempted.
 * @extends Error
 * @constructor
 * @param {string} [message] - The error message.
 */
export declare class InvalidOperationError extends Error {
    constructor(message?: string);
}
/**
 * Represents an error indicating an invalid state.
 * @param message - Optional. A message to describe the error.
 */
export declare class InvalidStateError extends Error {
    constructor(message?: string);
}
/**
 * Represents a custom error class for connection-related errors.
 * @class ConnectionError
 * @extends Error
 * @constructor
 * @param {string} [message] - The error message.
 */
export declare class ConnectionError extends Error {
    constructor(message?: string);
}
/**
 * Represents an error related to the environment.
 * @param {string} [message] - The error message.
 */
export declare class EnvironmentError extends Error {
    constructor(message?: string);
}
/**
 * Represents an error that occurs when an assertion fails.
 * @param message - Optional. A message to describe the error.
 */
export declare class AssertionFailedError extends Error {
    constructor(message?: string);
}
//# sourceMappingURL=Errors.d.ts.map