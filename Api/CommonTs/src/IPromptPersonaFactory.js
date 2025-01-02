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
 * - Predefined persona templates for Article, Code, and Survey summarization
 * - getSummariser function to generate configured prompt personas with
 *   customized word count targets
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatPersona = getChatPersona;
// Copyright (c) 2024 Braid Technologies Ltd
const IPromptPersona_1 = require("./IPromptPersona");
const ArticleSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kArticleSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
const CodeSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kCodeSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
const SurveySummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kSurveySummariser,
    systemPrompt: "",
    itemPrompt: ""
};
function getChatPersona(persona, textToSummarise, wordTarget) {
    const wordString = Math.floor(wordTarget).toString();
    switch (persona) {
        case IPromptPersona_1.EPromptPersona.kSurveySummariser:
            const surveyTemplate = SurveySummariserPersona;
            surveyTemplate.systemPrompt = "You are an AI asistant that summarises survey responses in "
                + wordString +
                " words or less, to explain it to the management team that issues the survey. Please summarise the following survey result in "
                + wordString + " words. Make each distinct point a separate paragraph. Be as positive as reasonably possible.";
            surveyTemplate.itemPrompt = textToSummarise;
            return surveyTemplate;
        case IPromptPersona_1.EPromptPersona.kCodeSummariser:
            const codeTemplate = CodeSummariserPersona;
            codeTemplate.systemPrompt = "You are an AI asistant that summarises code in "
                + wordString +
                " words or less, to help explain the code it to new developers. Please summarise the following code in "
                + wordString + " words. Make each distinct point a separate paragraph. List the important classes or functions in the module";
            codeTemplate.itemPrompt = textToSummarise;
            return codeTemplate;
        case IPromptPersona_1.EPromptPersona.kArticleSummariser:
        default:
            const articleTemplate = ArticleSummariserPersona;
            articleTemplate.systemPrompt = "You are an AI asistant that summarises text in "
                + wordString +
                " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Please summarise the following text in "
                + wordString + " words. Translate to English if necessary. Make each distinct point a separate paragraph.";
            articleTemplate.itemPrompt = textToSummarise;
            return ArticleSummariserPersona;
    }
}
//# sourceMappingURL=IPromptPersonaFactory.js.map