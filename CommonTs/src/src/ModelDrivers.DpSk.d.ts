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
import { EModel, EModelProvider, IChatModelDriver, IModelConversationElement, IModelConversationPrompt, IChatModelDriverParams } from './Interfaces/IModelDriver';
import { EPromptPersona } from 'promptmanager/dist';
import { IOpenAiChatModelInit, IOpenAiTextChunkerInit } from './ModelDrivers.OpAi';
export declare class DeepSeekR1TextChunkerInit implements IOpenAiTextChunkerInit {
    drivenModelProvider: EModelProvider;
    drivenModelType: EModel;
    defaultChunkSize: number;
    maximumChunkSize: number;
    embeddingChunkSize: number;
    defaultChunkSizeWithBuffer: number;
    embeddingChunkSizeWithBuffer: number;
    maximumChunkSizeWithBuffer: number;
    implementsModel: EModel;
}
export declare class DeepSeekR1ChatModelInit implements IOpenAiChatModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
/**
 * Class representing a driver for DeepSeek chat models.
 * Implements the IChatModelDriver interface to provide methods for
 * retrieving the model type and generating responses to conversation prompts.
 */
export declare class DeepSeekR1ChatModelDriver implements IChatModelDriver {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
    /**
     * Creates an instance of OpenAIChatModelDriver.
     * Initializes with default deployment name, model type, and provider.
     */
    constructor(params: DeepSeekR1ChatModelInit);
    generateResponse(persona: keyof typeof EPromptPersona, prompt: IModelConversationPrompt, params: IChatModelDriverParams): Promise<IModelConversationElement>;
}
//# sourceMappingURL=ModelDrivers.DpSk.d.ts.map