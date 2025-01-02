"use strict";
/**
 * @module IEnvironment
 * @description Defines the environment configuration interface and types for the Braid application.
 *
 * This module defines the environment configuration interface (IEnvironment) used across
 * the application to handle different deployment environments (Local, Staging, Production).
 * It provides type definitions for environment-specific API endpoints and service URLs.
 *
 * The interface includes methods for:
 * - Authentication and session management
 * - Content operations (summarization, classification, embedding)
 * - Activity tracking and management
 * - Chunk and page operations
 * - Integration endpoints (LinkedIn, Fluid, Teams)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EEnvironment = exports.BRAID_ENVIRONMENT_KEY = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
exports.BRAID_ENVIRONMENT_KEY = "BRAID_ENVIRONMENT";
var EEnvironment;
(function (EEnvironment) {
    EEnvironment["kLocal"] = "Local";
    EEnvironment["kStaging"] = "Staging";
    EEnvironment["kProduction"] = "Production";
})(EEnvironment || (exports.EEnvironment = EEnvironment = {}));
;
//# sourceMappingURL=IEnvironment.js.map