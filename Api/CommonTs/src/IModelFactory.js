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
// Internal imports
const IModelDriver_1 = require("./IModelDriver");
const ModelDrivers_OpAi_1 = require("./ModelDrivers.OpAi");
const ModelDrivers_DpSk_1 = require("./ModelDrivers.DpSk");
/**
 * Returns the default model which is an instance of GPT4o.
 * @returns {IModel} The default model.
 */
function getDefaultTextChunker() {
    return new ModelDrivers_OpAi_1.OpenAITextChunker(new ModelDrivers_OpAi_1.OpenAiGpt4oTextChunkerInit());
}
/**
 * Returns an instance of IModel based on the provided EModel type.
 *
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
function getTextChunker(model, provider) {
    switch (provider) {
        case IModelDriver_1.EModelProvider.kDeepSeek:
            return new ModelDrivers_OpAi_1.OpenAITextChunker(new ModelDrivers_DpSk_1.DeepSeekR1TextChunkerInit());
        case IModelDriver_1.EModelProvider.kOpenAI:
        default:
            switch (model) {
                case IModelDriver_1.EModel.kReasoning:
                    return new ModelDrivers_OpAi_1.OpenAITextChunker(new ModelDrivers_OpAi_1.OpenAiO1TextChunkerInit());
                case IModelDriver_1.EModel.kSmall:
                    return new ModelDrivers_OpAi_1.OpenAITextChunker(new ModelDrivers_OpAi_1.OpenAiGpt4oMiniTextChunkerInit());
                case IModelDriver_1.EModel.kLarge:
                default:
                    return new ModelDrivers_OpAi_1.OpenAITextChunker(new ModelDrivers_OpAi_1.OpenAiGpt4oTextChunkerInit());
            }
    }
}
/**
 * Returns an instance of IEmbeddingModelDriver for the default embedding model.
 * @returns {IEmbeddingModelDriver} The default embedding model driver.
 */
function getDefaultEmbeddingModelDriver() {
    return new ModelDrivers_OpAi_1.OpenAIEmbeddingModelDriver(new ModelDrivers_OpAi_1.OpenAiEmbed3EmbeddingModelInit());
}
/**
 * Returns an instance of IEmbeddingModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IEmbeddingModelDriver} An instance of IEmbeddingModelDriver corresponding to the specified EModel type.
 */
function getEmbeddingModelDriver(model, provider) {
    switch (model) {
        case IModelDriver_1.EModel.kSmall:
            return new ModelDrivers_OpAi_1.OpenAIEmbeddingModelDriver(new ModelDrivers_OpAi_1.OpenAiEmbed3SmallEmbeddingModelInit());
        case IModelDriver_1.EModel.kLarge:
        case IModelDriver_1.EModel.kReasoning:
        default:
            return new ModelDrivers_OpAi_1.OpenAIEmbeddingModelDriver(new ModelDrivers_OpAi_1.OpenAiEmbed3EmbeddingModelInit());
    }
}
function getDefaultChatModelDriver() {
    return new ModelDrivers_OpAi_1.OpenAIChatModelDriver(new ModelDrivers_OpAi_1.OpenAi4oChatModelInit());
}
/**
 * Returns an instance of IChatModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IChatModelDriver} An instance of IChatModelDriver corresponding to the specified EModel type.
 */
function getChatModelDriver(model, provider) {
    switch (provider) {
        case IModelDriver_1.EModelProvider.kDeepSeek:
            return new ModelDrivers_DpSk_1.DeepSeekR1ChatModelDriver(new ModelDrivers_DpSk_1.DeepSeekR1ChatModelInit());
        case IModelDriver_1.EModelProvider.kOpenAI:
        default:
            switch (model) {
                case IModelDriver_1.EModel.kReasoning:
                    return new ModelDrivers_OpAi_1.OpenAIChatModelDriver(new ModelDrivers_OpAi_1.OpenAiO1ChatModelInit());
                case IModelDriver_1.EModel.kSmall:
                    return new ModelDrivers_OpAi_1.OpenAIChatModelDriver(new ModelDrivers_OpAi_1.OpenAi4oMiniChatModelInit());
                case IModelDriver_1.EModel.kLarge:
                default:
                    return new ModelDrivers_OpAi_1.OpenAIChatModelDriver(new ModelDrivers_OpAi_1.OpenAi4oChatModelInit());
            }
    }
}
//# sourceMappingURL=IModelFactory.js.map