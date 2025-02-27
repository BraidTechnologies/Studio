"use strict";
/**
 * @module IPromptPersonaFactory
 *
 * This module provides functionality to generate specialized AI prompt personas
 * for different types of content summarization (articles, code, surveys).
 * Each persona includes a system prompt and an item prompt tailored to the
 * specific summarization task.
 *
 * The module exports:
 * - Predefined persona templates for summarization etc
 * - getChatPersona function to generate configured prompt personas with
 *   optional customized parameters
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatPersona = getChatPersona;
const IPromptPersona_1 = require("./IPromptPersona");
const IPromptRepository_1 = require("./IPromptRepository");
const Asserts_1 = require("./Asserts");
const Prompts_json_1 = __importDefault(require("./Prompts.json"));
const GeneratedPromptNames_1 = require("./GeneratedPromptNames");
const promptRepository = new IPromptRepository_1.PromptInMemoryRepository(Prompts_json_1.default);
const defaultWordCount = 50;
const questionWordCount = 10;
const themeFinderWordCount = 1;
function postProcessPrompt(prompt, defaultWordCount, userInput) {
    if (typeof prompt !== "undefined") {
        let systemPrompt = prompt.systemPrompt.replace("{wordCount}", defaultWordCount.toString());
        let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
        return { userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName };
    }
    throw new Error("Prompt not found");
}
function postProcessClassifierPrompt(prompt, classifications, userInput) {
    if (typeof prompt !== "undefined") {
        let systemPrompt = prompt.systemPrompt.replace("{classifications}", classifications);
        let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
        return { userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName };
    }
    throw new Error("Prompt not found");
}
const ArticleContextSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kArticleContextSummariser,
    systemPrompt: "",
    userPrompt: ""
};
const CodeSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kCodeSummariser,
    systemPrompt: "",
    userPrompt: ""
};
const C4DiagrammerPersona = {
    name: IPromptPersona_1.EPromptPersona.kC4Diagrammer,
    systemPrompt: "",
    userPrompt: ""
};
const SurveySummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kSurveySummariser,
    systemPrompt: "",
    userPrompt: ""
};
function getChatPersona(persona, userPrompt, params) {
    let wordString = "50";
    if (params && params.wordTarget) {
        wordString = params.wordTarget.toString();
    }
    let promptParam1 = "";
    if (params && params.promptParam1) {
        promptParam1 = params.promptParam1;
    }
    let prompt = undefined;
    switch (persona) {
        // Boxer Prompts   
        case IPromptPersona_1.EPromptPersona.kDeveloperAssistant:
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.developerAssistantPromptId);
            return postProcessPrompt(prompt, defaultWordCount, userPrompt);
        case IPromptPersona_1.EPromptPersona.kDeveloperQuestionGenerator:
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.developerQuestionGeneratorPromptId);
            return postProcessPrompt(prompt, questionWordCount, userPrompt);
        case IPromptPersona_1.EPromptPersona.kDeveloperImaginedAnswerGenerator:
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.developerImaginedAnswerGeneratorPromptId);
            return postProcessPrompt(prompt, defaultWordCount, userPrompt);
        // Waterfall Prompts
        case IPromptPersona_1.EPromptPersona.kArticleSummariser:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.wordTarget);
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.articleSummariserPromptId);
            return postProcessPrompt(prompt, params.wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kArticleClassifier:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.classifications);
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.articleClassifierPromptId);
            return postProcessClassifierPrompt(prompt, params.classifications, userPrompt);
        case IPromptPersona_1.EPromptPersona.kThemeFinder:
            (0, Asserts_1.throwIfUndefined)(params === null || params === void 0 ? void 0 : params.wordTarget);
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.themeFinderPromptId);
            return postProcessPrompt(prompt, params.wordTarget, userPrompt);
        case IPromptPersona_1.EPromptPersona.kTestForSummariseFail:
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.testForSummmariseFailurePromptId);
            return postProcessPrompt(prompt, defaultWordCount, userPrompt);
        // Salon Prompts
        case IPromptPersona_1.EPromptPersona.kSurveySummariser:
            const surveyTemplate = SurveySummariserPersona;
            surveyTemplate.systemPrompt = "You are an AI assistant that summarises survey responses in "
                + wordString +
                " words or less, to explain it to the management team that issues the survey.";
            surveyTemplate.userPrompt = "Please summarise the following survey result in ";
        case IPromptPersona_1.EPromptPersona.kCodeSummariser:
            const codeTemplate = CodeSummariserPersona;
            codeTemplate.systemPrompt = "You are an AI assistant that summarises code to help explain the code to new developers. Please summarise the following code in "
                + wordString + " words. Make each distinct point a separate paragraph. List the important classes or functions in the module";
            codeTemplate.userPrompt = userPrompt;
            return codeTemplate;
        case IPromptPersona_1.EPromptPersona.kC4Diagrammer:
            const c4Template = C4DiagrammerPersona;
            c4Template.systemPrompt = "You are an AI assistant that generates a diagram in mermaid format from a description of a software system "
                + "to help explain the system to new developers.";
            c4Template.userPrompt = userPrompt;
            return c4Template;
        case IPromptPersona_1.EPromptPersona.kArticleContextSummariser:
            const articleContextTemplate = ArticleContextSummariserPersona;
            articleContextTemplate.systemPrompt = "You are an AI assistant that summarises text in "
                + wordString +
                " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Translate to English if necessary. Make each distinct point a separate paragraph.";
            articleContextTemplate.userPrompt = userPrompt;
            return articleContextTemplate;
        default:
            prompt = promptRepository.getPrompt(GeneratedPromptNames_1.defaultPromptId);
            return postProcessPrompt(prompt, defaultWordCount, userPrompt);
    }
}
//# sourceMappingURL=IPromptPersonaFactory.js.map