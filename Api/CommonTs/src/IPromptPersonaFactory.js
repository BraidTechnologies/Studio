"use strict";
/**
 * @module IPromptPersonaFactory
 *
 * This module provides a factory for creating specialized AI prompt personas used in different
 * conversational contexts. It loads prompt templates from multiple sources (Default, Boxer,
 * Waterfall, Salon) and provides functionality to:
 *
 * - Create personas for article summarization and classification
 * - Generate code documentation and C4 diagrams
 * - Assist with developer questions and answers
 * - Process survey responses and find themes
 *
 * Each persona is configured with system and user prompts that can be customized with
 * parameters like word count limits and specific classifications.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatPersona = getChatPersona;
const IPromptPersona_1 = require("./IPromptPersona");
const IPromptRepository_1 = require("./IPromptRepository");
const Asserts_1 = require("./Asserts");

const Default_Prompts_json_1 = __importDefault(require("./Default.Prompts.json"));
const Boxer_Prompts_json_1 = __importDefault(require("./Boxer.Prompts.json"));
const Waterfall_Prompts_json_1 = __importDefault(require("./Waterfall.Prompts.json"));
const Salon_Prompts_json_1 = __importDefault(require("./Salon.Prompts.json"));
const GeneratedDefaultPromptNames_1 = require("./GeneratedDefaultPromptNames");
const GeneratedBoxerPromptNames_1 = require("./GeneratedBoxerPromptNames");
const GeneratedWaterfallPromptNames_1 = require("./GeneratedWaterfallPromptNames");
const GeneratedSalonPromptNames_1 = require("./GeneratedSalonPromptNames");
const allPrompts = [...Default_Prompts_json_1.default, ...Boxer_Prompts_json_1.default, ...Waterfall_Prompts_json_1.default, ...Salon_Prompts_json_1.default];
const promptRepository = new IPromptRepository_1.PromptInMemoryRepository(allPrompts);
const defaultWordCount = 50;
/**
 * Post-processes a stored prompt by replacing placeholders with actual values
 * @param prompt The stored prompt template to process
 * @param wordCount The default word count to use in the prompt
 * @param userInput The user input to insert into the prompt
 * @returns A processed prompt persona with placeholders replaced
 * @throws Error if the prompt is not found
 */
function postProcessPrompt(prompt, wordCount, userInput) {
    if (typeof prompt !== "undefined") {
        let systemPrompt = prompt.systemPrompt.replace("{wordCount}", wordCount.toString());
        let userPrompt = prompt.userPrompt.replace("{userInput}", userInput).replace("{wordCount}", wordCount.toString());
        return { userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName };
    }
    throw new Error("Prompt not found");
}

/**
 * Post-processes a classifier prompt by replacing classification and input placeholders
 * @param prompt The stored prompt template to process
 * @param classifications The classification categories to use
 * @param userInput The user input to classify
 * @returns A processed prompt persona with placeholders replaced
 * @throws Error if the prompt is not found
 */

function postProcessClassifierPrompt(prompt, classifications, userInput) {
    if (typeof prompt !== "undefined") {
        let systemPrompt = prompt.systemPrompt.replace("{classifications}", classifications);
        let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
        return { userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName };
    }
    throw new Error("Prompt not found");
}

/**
 * Post-processes a C4 diagrammer prompt by replacing the user input and C4 diagram type placeholders
 * @param prompt The stored prompt template to process
 * @param c4DiagramType The type of C4 diagram to generate
 * @param userInput The user input to insert into the prompt
 * @returns A processed prompt persona with placeholders replaced
 */
function postProcessC4DiagrammerPrompt(prompt, c4DiagramType, userInput) {
    if (typeof prompt !== "undefined") {
        let userPrompt = prompt.userPrompt.replace("{userInput}", userInput).replace("{C4DiagramType}", c4DiagramType);
        return { userPrompt: userPrompt, systemPrompt: prompt.systemPrompt, name: prompt.personaName };
    }
    throw new Error("Prompt not found");
}
function postProcessArticleContextPrompt(prompt, wordCount, chunk, document) {
    if (typeof prompt !== "undefined") {
        let systemPrompt = prompt.systemPrompt.replace("{wordCount}", wordCount.toString());
        let userPrompt = prompt.userPrompt.replace("{chunk}", chunk).replace("{document}", document).replace("{wordCount}", wordCount.toString());
        return { userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName };
    }
    throw new Error("Prompt not found");
}
/**
 * Creates a chat persona with a specific prompt persona and user input
 * @param persona The prompt persona to use
 * @param userPrompt The user input to insert into the prompt
 * @param params Optional parameters for the prompt
 * @returns A processed prompt persona with placeholders replaced
 */
function getChatPersona(persona, userPrompt, params) {
    let wordTarget = defaultWordCount;
    if (params && params.wordTarget) {
        wordTarget = params.wordTarget;
    }
    let promptParam1 = "";
    if (params && params.promptParam1) {
        promptParam1 = params.promptParam1;
    }
    let c4DiagramType = "";
    if (params && params.c4DiagramType) {
        c4DiagramType = params.c4DiagramType;
    }
    let chunk = "";
    if (params && params.chunk) {
        chunk = params.chunk;
    }
    let document = "";
    if (params && params.document) {
        document = params.document;
    }
    let prompt = undefined;
    switch (persona) {
        // Boxer Prompts   
        case IPromptPersona_1.EPromptPersona.kDeveloperAssistant:
            prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames_1.developerAssistantPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kDeveloperQuestionGenerator:
            prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames_1.developerQuestionGeneratorPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kDeveloperImaginedAnswerGenerator:
            prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames_1.developerImaginedAnswerGeneratorPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        // Waterfall Prompts
        case IPromptPersona_1.EPromptPersona.kArticleSummariser:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.wordTarget);
            prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames_1.articleSummariserPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kArticleClassifier:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.classifications);
            prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames_1.articleClassifierPromptId);
            return postProcessClassifierPrompt(prompt, params.classifications, userPrompt);
        case IPromptPersona_1.EPromptPersona.kThemeFinder:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.wordTarget);
            prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames_1.themeFinderPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kTestForSummariseFail:
            prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames_1.testForSummmariseFailurePromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kSurveySummariser:
            prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames_1.surveySummariserPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        // Salon Prompts         
        case IPromptPersona_1.EPromptPersona.kCodeSummariser:
            prompt = promptRepository.getPrompt(GeneratedSalonPromptNames_1.codeSummariserPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kC4Diagrammer:
            prompt = promptRepository.getPrompt(GeneratedSalonPromptNames_1.c4DiagrammerPromptId);
            return postProcessC4DiagrammerPrompt(prompt, c4DiagramType, userPrompt);
        case IPromptPersona_1.EPromptPersona.kArticleContextSummariser:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.chunk);
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.document);
            prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames_1.articleContextSummariserPromptId);
            return postProcessArticleContextPrompt(prompt, wordTarget, params === null || params === void 0 ? void 0 : params.chunk, params === null || params === void 0 ? void 0 : params.document);
        default:
            prompt = promptRepository.getPrompt(GeneratedDefaultPromptNames_1.defaultPromptId);
            return postProcessPrompt(prompt, wordTarget, userPrompt);
    }
}
//# sourceMappingURL=IPromptPersonaFactory.js.map