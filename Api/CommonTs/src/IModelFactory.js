"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module IModelFactory
 * @description Factory module for creating AI model instances.
 *
 * This module provides factory functions to create appropriate model instances
 * based on the requested model type. It supports:
 * - Default model creation through getDefaultModel()
 * - Specific model creation through getModel() based on EModel type
 *
 * The factory ensures consistent model instantiation across the application
 * while abstracting the concrete model implementation details.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultModel = getDefaultModel;
exports.getModel = getModel;
exports.getDefaultEmbeddingModelDriver = getDefaultEmbeddingModelDriver;
exports.getEmbeddingModelDriver = getEmbeddingModelDriver;
const Model_OAI_1 = require("./Model.OAI");
const IModelDrivers_OAI_1 = require("./IModelDrivers.OAI");
/**
 * Returns the default model which is an instance of GPT4oMini.
 * @returns {IModel} The default model.
 */
function getDefaultModel() {
    return new Model_OAI_1.GPT4();
}
/**
 * Returns an instance of IModel based on the provided EModel type.
 *
 * @param model - The EModel type to determine the model.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
function getModel(model) {
    switch (model) {
        default:
            return new Model_OAI_1.GPT4();
    }
}
function getDefaultEmbeddingModelDriver() {
    return new IModelDrivers_OAI_1.OpenAIEmbeddingModelDriver();
}
/**
 * Returns an instance of IModel based on the provided EModel type.
 *
 * @param model - The EModel type to determine the model.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
function getEmbeddingModelDriver(model) {
    switch (model) {
        default:
            return new IModelDrivers_OAI_1.OpenAIEmbeddingModelDriver();
    }
}
//# sourceMappingURL=IModelFactory.js.map