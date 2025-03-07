/**
 * @module ModelDrivers.OpAi
 *
 * This module provides OpenAI-specific implementations for embedding model drivers.
 * It includes functionality to calculate text embeddings using Azure OpenAI services.
 *
 * Key components:
 * - OpenAIEmbeddingModelDriver: Implementation of IEmbeddingModelDriver for OpenAI
 * - calculateEmbedding: Utility function to compute embeddings via Azure OpenAI API
 *
 */
import { EModel, EModelProvider, IEmbeddingModelDriver, IChatModelDriver, IModelConversationElement, IModelConversationPrompt, IChatModelDriverParams, ITextChunker } from './Interfaces/IModelDriver';
import { EPromptPersona } from 'promptmanager/dist';
export interface OpenAIChatElement {
    role: string;
    content: string;
}
export interface IOpenAiEmbeddingModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
export declare class OpenAiEmbed3EmbeddingModelInit implements IOpenAiEmbeddingModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
export declare class OpenAiEmbed3SmallEmbeddingModelInit implements IOpenAiEmbeddingModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
/**
 * Class representing an OpenAI embedding model driver.
 * Implements the IEmbeddingModelDriver interface.
 *
 * @method embed
 * @param {string} text - The text to be embedded.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of numbers representing the embedding.
 * @throws {Error} Throws an error if the method is not implemented.
 */
export declare class OpenAIEmbeddingModelDriver implements IEmbeddingModelDriver {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
    constructor(params: IOpenAiEmbeddingModelInit);
    embed(text: string): Promise<Array<number>>;
}
/**
 * Asynchronously calculates the embedding for the given text using the Azure AI service.
 *
 * @param text The text for which the embedding needs to be calculated.
 * @param urlElement The element of the URL to use for the embedding.
 * @returns A Promise that resolves to an array of numbers representing the calculated embedding.
 */
export declare function calculateEmbedding(text: string, urlElement: string): Promise<Array<number>>;
/**
 * Interface defining initialization parameters for OpenAI chat models.
 * Used to configure model instances with deployment details and model characteristics.
 *
 * @interface IOpenAiChatModelInit
 * @property {string} deploymentName - The name of the model deployment to use
 * @property {EModel} drivenModelType - The type/size category of the model
 * @property {EModelProvider} drivenModelProvider - The provider of the model (OpenAI)
 */
export interface IOpenAiChatModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
export declare class OpenAi4oChatModelInit implements IOpenAiChatModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
export declare class OpenAi4oMiniChatModelInit implements IOpenAiChatModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
export declare class OpenAiO1ChatModelInit implements IOpenAiChatModelInit {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
}
/**
 * Class representing a driver for OpenAI chat models.
 * Implements the IChatModelDriver interface to provide methods for
 * retrieving the model type and generating responses to conversation prompts.
 */
export declare class OpenAIChatModelDriver implements IChatModelDriver {
    deploymentName: string;
    urlElement: string;
    drivenModelType: EModel;
    drivenModelProvider: EModelProvider;
    /**
     * Creates an instance of OpenAIChatModelDriver.
     * Initializes with default deployment name, model type, and provider.
     */
    constructor(params: IOpenAiChatModelInit);
    generateResponse(persona: keyof typeof EPromptPersona, prompt: IModelConversationPrompt, params: IChatModelDriverParams): Promise<IModelConversationElement>;
}
export interface IOpenAiTextChunkerInit {
    drivenModelProvider: EModelProvider;
    drivenModelType: EModel;
    defaultChunkSize: number;
    maximumChunkSize: number;
    embeddingChunkSize: number;
    defaultChunkSizeWithBuffer: number;
    maximumChunkSizeWithBuffer: number;
    embeddingChunkSizeWithBuffer: number;
    implementsModel: EModel;
}
export declare class OpenAiGpt4oMiniTextChunkerInit implements IOpenAiTextChunkerInit {
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
export declare class OpenAiGpt4oTextChunkerInit implements IOpenAiTextChunkerInit {
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
export declare class OpenAiO1TextChunkerInit implements IOpenAiTextChunkerInit {
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
/**
 * GPT4 class implementing ITextChunker interface.
 * Represents a model with specific deployment settings and context window sizes.
 */
export declare class OpenAITextChunker implements ITextChunker {
    drivenModelProvider: EModelProvider;
    drivenModelType: EModel;
    defaultChunkSize: number;
    maximumChunkSize: number;
    embeddingChunkSize: number;
    defaultChunkSizeWithBuffer: number;
    embeddingChunkSizeWithBuffer: number;
    maximumChunkSizeWithBuffer: number;
    implementsModel: EModel;
    constructor(params: IOpenAiTextChunkerInit);
    /**
     * Checks if the given text fits within the context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInDefaultChunk(text: string): boolean;
    /**
     * Checks if the given text fits within the maximum context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInMaximumChunk(text: string): boolean;
    /**
     * Checks if the given text fits within the embedding context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInEmbeddingChunk(text: string): boolean;
    /**
     * Splits the input text into chunks based on the specified overlap of words.
     *
     * @param text The text to be chunked.
     * @param overlapWords The number of overlapping words between consecutive chunks. If undefined, we chunk with no obverlap.
     * @returns An array of strings representing the chunked text.
     */
    chunkText(text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string>;
    /**
     * Estimates the number of tokens in the provided text using the tokenizer.
     *
     * @param text The text for which to estimate the number of tokens.
     * @returns The estimated number of tokens in the text.
     */
    estimateTokens(text: string): number;
}
//# sourceMappingURL=ModelDrivers.OpAi.d.ts.map