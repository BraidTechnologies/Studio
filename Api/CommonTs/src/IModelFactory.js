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
exports.getDefaultTextChunker = getDefaultTextChunker;
exports.getTextChunker = getTextChunker;
exports.getDefaultEmbeddingModelDriver = getDefaultEmbeddingModelDriver;
exports.getEmbeddingModelDriver = getEmbeddingModelDriver;
exports.getDefaultChatModelDriver = getDefaultChatModelDriver;
exports.getChatModelDriver = getChatModelDriver;
const ModelDrivers_OAI_1 = require("./ModelDrivers.OAI");
/**
 * Returns the default model which is an instance of GPT4o.
 * @returns {IModel} The default model.
 */
function getDefaultTextChunker() {
    return new ModelDrivers_OAI_1.OpenAITextChunker();
}
/**
 * Returns an instance of IModel based on the provided EModel type.
 *
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
function getTextChunker(model, provider) {
    switch (model) {
        default:
            return new ModelDrivers_OAI_1.OpenAITextChunker();
    }
}
/**
 * Returns an instance of IEmbeddingModelDriver for the default embedding model.
 * @returns {IEmbeddingModelDriver} The default embedding model driver.
 */
function getDefaultEmbeddingModelDriver() {
    return new ModelDrivers_OAI_1.OpenAIEmbeddingModelDriver();
}
/**
 * Returns an instance of IEmbeddingModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IEmbeddingModelDriver} An instance of IEmbeddingModelDriver corresponding to the specified EModel type.
 */
function getEmbeddingModelDriver(model, provider) {
    switch (model) {
        default:
            return new ModelDrivers_OAI_1.OpenAIEmbeddingModelDriver();
    }
}
function getDefaultChatModelDriver() {
    return new ModelDrivers_OAI_1.OpenAIChatModelDriver();
}
/**
 * Returns an instance of IChatModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IChatModelDriver} An instance of IChatModelDriver corresponding to the specified EModel type.
 */
function getChatModelDriver(model, provider) {
    switch (model) {
        default:
            return new ModelDrivers_OAI_1.OpenAIChatModelDriver();
    }
}
//# sourceMappingURL=IModelFactory.js.map