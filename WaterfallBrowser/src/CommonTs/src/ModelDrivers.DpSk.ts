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

<<<<<<< HEAD
// Copyright (c) 2024, 2025 Braid Technologies Ltd
=======
// Copyright (c) 2024 Braid Technologies Ltd
>>>>>>> ee11e498699947e471c4c8ff5e65f71bfca7d97e

import Groq from "groq-sdk";

let deepSeekModel = "deepseek-r1-distill-llama-70b";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Internal imports
import { EModel, EModelProvider, IChatModelDriver,IModelConversationElement, IModelConversationPrompt, EModelConversationRole, IChatModelDriverParams} from './IModelDriver';
import { EPromptPersona } from './IPromptPersona';
import { IOpenAiChatModelInit, IOpenAiTextChunkerInit, OpenAIChatElement } from './ModelDrivers.OpAi';
import { getChatPersona } from "./IPromptPersonaFactory";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";


export class DeepSeekR1TextChunkerInit implements IOpenAiTextChunkerInit {

   drivenModelProvider: EModelProvider = EModelProvider.kDeepSeek;
   drivenModelType: EModel = EModel.kReasoning;
   defaultChunkSize = 8192;
   maximumChunkSize = 65536;
   embeddingChunkSize = 8191;
   defaultChunkSizeWithBuffer = (8192 - 256)
   embeddingChunkSizeWithBuffer = (8191 - 256)
   maximumChunkSizeWithBuffer = (65536 - 256) 
   implementsModel: EModel = EModel.kReasoning;   
}

export class DeepSeekR1ChatModelInit implements IOpenAiChatModelInit {
   deploymentName : string = "DeepSeekR1";
   urlElement: string = "StudioReasoning";
   drivenModelType: EModel = EModel.kReasoning;
   drivenModelProvider: EModelProvider = EModelProvider.kDeepSeek;
}

/**
 * Class representing a driver for DeepSeek chat models.
 * Implements the IChatModelDriver interface to provide methods for
 * retrieving the model type and generating responses to conversation prompts.
 */
export class DeepSeekR1ChatModelDriver implements IChatModelDriver {

   deploymentName : string = "DeepSeekR1";
   urlElement: string = "StudioReasoning";
   drivenModelType: EModel = EModel.kReasoning;
   drivenModelProvider: EModelProvider = EModelProvider.kDeepSeek;

   /**
    * Creates an instance of OpenAIChatModelDriver.
    * Initializes with default deployment name, model type, and provider.
    */
   constructor(params: DeepSeekR1ChatModelInit) {
      this.deploymentName = params.deploymentName;
      this.urlElement = params.urlElement;
      this.drivenModelType = params.drivenModelType;
      this.drivenModelProvider = params.drivenModelProvider;
   }


   generateResponse(persona: EPromptPersona, prompt: IModelConversationPrompt, 
      params: IChatModelDriverParams): Promise<IModelConversationElement> {

      return chat(persona, prompt, params);
   }
}

/**
 * Removes all text enclosed within <think> tags from the input string.
 *
 * @param input - The string from which to remove text between <think> tags.
 * @returns A new string with all <think>...</think> content removed.
 */
function stripTextBetweenThink(input: string): string {
   const regex = /<think>(.|\n)*?<\/think>/gi;
   return input.replace(regex, '');
}

/**
 * Strips carriage return or line feed characters from the beginning of a string.
 * 
 * @param input The input string to process
 * @returns The input string with leading CR/LF characters removed
 */
function stripLeadingCRLF(input: string): string {
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

async function chat(persona: EPromptPersona, prompt: IModelConversationPrompt, 
   params: IChatModelDriverParams): Promise<IModelConversationElement> {

   const summariser = getChatPersona(persona, prompt.prompt, params);

   const systemPrompt = summariser.systemPrompt;
   const userPrompt = summariser.itemPrompt;

   let messages: Array<ChatCompletionMessageParam> = [];

   messages.push({
      role: EModelConversationRole.kSystem,
      content: systemPrompt
   });

   for (const message of prompt.history) {
      messages.push({
         role: message.role,
         content: message.content
      });
   }

   messages.push({
      role: EModelConversationRole.kUser,
      content: userPrompt
   });

   try {    
       console.log("DeepSeek!");
       let groqChatCompletion = await groq.chat.completions.create({
           messages: messages,
           model: deepSeekModel
        });

        let stripped = stripTextBetweenThink(groqChatCompletion.choices[0]?.message?.content || "");
        stripped = stripLeadingCRLF(stripped);
        
        return {role: EModelConversationRole.kAssistant, 
           content: stripped};
   }
   catch (error) {
      console.error(error);
      throw error;
   }

}