"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultEnvironment = getDefaultEnvironment;
exports.getEnvironment = getEnvironment;
// Internal imports
const IEnvironment_1 = require("./IEnvironment");
const Environment_1 = require("./Environment");
/**
 * Returns the default environment which is an instance of ProductionEnvironment.
 * @returns {IEnvironment} The default environment instance.
 */
function getDefaultEnvironment() {
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