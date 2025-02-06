"use strict";
/**
 * @module ModelDrivers.DpSk
 *
 * This module provides DeepSeek-specific implementations for embedding model drivers.
 * It includes functionality to calculate text embeddings using DeepSeek services.
 *
 * Key components:
 * - DeepSeekR1TextChunker: Implementation of ITextChunker for DeepSeek
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepSeekR1ChatModelDriver = exports.DeepSeekR1ChatModelInit = exports.DeepSeekR1TextChunkerInit = void 0;
// Copyright (c) 2024, 2025 Braid Technologies Ltd
const groq_sdk_1 = __importDefault(require("groq-sdk"));
let deepSeekModel = "deepseek-r1-distill-llama-70b";
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
// Internal imports
const IModelDriver_1 = require("./IModelDriver");
const IPromptPersonaFactory_1 = require("./IPromptPersonaFactory");
class DeepSeekR1TextChunkerInit {
    constructor() {
        this.drivenModelProvider = IModelDriver_1.EModelProvider.kDeepSeek;
        this.drivenModelType = IModelDriver_1.EModel.kReasoning;
        this.defaultChunkSize = 8192;
        this.maximumChunkSize = 65536;
        this.embeddingChunkSize = 8191;
        this.defaultChunkSizeWithBuffer = (8192 - 256);
        this.embeddingChunkSizeWithBuffer = (8191 - 256);
        this.maximumChunkSizeWithBuffer = (65536 - 256);
        this.implementsModel = IModelDriver_1.EModel.kReasoning;
    }
}
exports.DeepSeekR1TextChunkerInit = DeepSeekR1TextChunkerInit;
class DeepSeekR1ChatModelInit {
    constructor() {
        this.deploymentName = "DeepSeekR1";
        this.urlElement = "StudioReasoning";
        this.drivenModelType = IModelDriver_1.EModel.kReasoning;
        this.drivenModelProvider = IModelDriver_1.EModelProvider.kDeepSeek;
    }
}
exports.DeepSeekR1ChatModelInit = DeepSeekR1ChatModelInit;
/**
 * Class representing a driver for DeepSeek chat models.
 * Implements the IChatModelDriver interface to provide methods for
 * retrieving the model type and generating responses to conversation prompts.
 */
class DeepSeekR1ChatModelDriver {
    /**
     * Creates an instance of OpenAIChatModelDriver.
     * Initializes with default deployment name, model type, and provider.
     */
    constructor(params) {
        this.deploymentName = "DeepSeekR1";
        this.urlElement = "StudioReasoning";
        this.drivenModelType = IModelDriver_1.EModel.kReasoning;
        this.drivenModelProvider = IModelDriver_1.EModelProvider.kDeepSeek;
        this.deploymentName = params.deploymentName;
        this.urlElement = params.urlElement;
        this.drivenModelType = params.drivenModelType;
        this.drivenModelProvider = params.drivenModelProvider;
    }
    generateResponse(persona, prompt, params) {
        return chat(persona, prompt, params);
    }
}
exports.DeepSeekR1ChatModelDriver = DeepSeekR1ChatModelDriver;
/**
 * Removes all text enclosed within <think> tags from the input string.
 *
 * @param input - The string from which to remove text between <think> tags.
 * @returns A new string with all <think>...</think> content removed.
 */
function stripTextBetweenThink(input) {
    const regex = /<think>(.|\n)*?<\/think>/gi;
    return input.replace(regex, '');
}
/**
 * Strips carriage return or line feed characters from the beginning of a string.
 *
 * @param input The input string to process
 * @returns The input string with leading CR/LF characters removed
 */
function stripLeadingCRLF(input) {
    return input.replace(/^[\r\n]+/, '');
}
/**
 * Asynchronously generates a chat response using the DeepSeek service.
 *
 * @param persona The type of persona (ArticleSummariser, CodeSummariser, or SurveySummariser) to use for the response
 * @param prompt The conversation prompt containing the system and user messages
 * @param params The parameters for the prompt
 * @returns A Promise that resolves to a model conversation element containing the LLM response
 */
function chat(persona, prompt, params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const summariser = (0, IPromptPersonaFactory_1.getChatPersona)(persona, prompt.prompt, params);
        const systemPrompt = summariser.systemPrompt;
        const userPrompt = summariser.itemPrompt;
        let messages = [];
        messages.push({
            role: IModelDriver_1.EModelConversationRole.kSystem,
            content: systemPrompt
        });
        for (const message of prompt.history) {
            messages.push({
                role: message.role,
                content: message.content
            });
        }
        messages.push({
            role: IModelDriver_1.EModelConversationRole.kUser,
            content: userPrompt
        });
        try {
            console.log("DeepSeek!");
            let groqChatCompletion = yield groq.chat.completions.create({
                messages: messages,
                model: deepSeekModel
            });
            let stripped = stripTextBetweenThink(((_b = (_a = groqChatCompletion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "");
            stripped = stripLeadingCRLF(stripped);
            return { role: IModelDriver_1.EModelConversationRole.kAssistant,
                content: stripped };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
//# sourceMappingURL=ModelDrivers.DpSk.js.map