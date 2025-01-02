"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCoreError = logCoreError;
exports.logDbError = logDbError;
exports.logApiError = logApiError;
exports.logApiInfo = logApiInfo;
/**
 * Logs a core error with the provided description and details.
 *
 * @param description - A brief description of the core error.
 * @param details - Additional details related to the core error.
 * @returns void
 */
function logCoreError(description, details) {
    console.error("Core error:" + description + "Details:" + details.toString());
}
/**
 * Logs a database error with the provided description and details.
 *
 * @param description - A brief description of the error.
 * @param details - Additional details about the error.
 * @returns void
 */
function logDbError(description, details) {
    console.error("Database error:" + description + "Details:" + details.toString());
}
/**
 * Logs an API error with the provided description and details.
 *
 * @param description A brief description of the API error.
 * @param details Additional details related to the API error.
 * @returns void
 */
function logApiError(description, details) {
    console.error("Api error:" + description + "Details:" + details.toString());
}
/**
 * Logs API information.
 *
 * @param description - A brief description of the API information.
 * @param details - Additional details about the API information.
 * @returns void
 */
function logApiInfo(description, details) {
    console.log("Api Info:" + description + "Details:" + details.toString());
}
//# sourceMappingURL=Logging.js.map