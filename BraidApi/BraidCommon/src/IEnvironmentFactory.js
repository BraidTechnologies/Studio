"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultEnvironment = getDefaultEnvironment;
exports.getEnvironment = getEnvironment;
// Internal imports
const IEnvironment_1 = require("./IEnvironment");
const Environment_1 = require("./Environment");
/**
 * Returns the default environment based on the current execution context.
 * If running in a browser and on localhost, returns a DevelopmentEnvironment instance.
 * If the process environment variable BRAID_ENVIRONMENT is set to 'Local', returns a DevelopmentEnvironment instance.
 * Otherwise, returns a ProductionEnvironment instance.
 * @returns An instance of IEnvironment representing the default environment.
 */
function getDefaultEnvironment() {
    // If we are i Browser, and in localhost, use development
    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost') {
            return new Environment_1.DevelopmentEnvironment();
        }
    }
    if (typeof process !== 'undefined') {
        if (process.env.BRAID_ENVIRONMENT === IEnvironment_1.EEnvironment.kLocal) {
            return new Environment_1.DevelopmentEnvironment();
        }
    }
    return new Environment_1.ProductionEnvironment();
}
/**
 * Returns an instance of IEnvironment based on the provided EEnvironment type.
 *
 * @param environmentString - The EEnvironment type to determine the environment.
 * @returns An instance of IEnvironment corresponding to the specified EEnvironment type.
 */
function getEnvironment(environmentString) {
    switch (environmentString) {
        case IEnvironment_1.EEnvironment.kLocal:
            return new Environment_1.DevelopmentEnvironment();
        case IEnvironment_1.EEnvironment.kStaging:
            return new Environment_1.StagingEnvironment();
        case IEnvironment_1.EEnvironment.kProduction:
        default:
            return new Environment_1.ProductionEnvironment();
    }
}
//# sourceMappingURL=IEnvironmentFactory.js.map