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
const IPromptPersona_1 = require("./IPromptPersona");
const DefaultPersona = {
    name: IPromptPersona_1.EPromptPersona.kDefault,
    systemPrompt: "",
    itemPrompt: ""
};
const DeveloperAssistantPersona = {
    name: IPromptPersona_1.EPromptPersona.kDeveloperAssistant,
    systemPrompt: "",
    itemPrompt: ""
};
const ArticleSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kArticleSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
const ArticleContextSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kArticleContextSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
const CodeSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kCodeSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
const C4DiagrammerPersona = {
    name: IPromptPersona_1.EPromptPersona.kC4Diagrammer,
    systemPrompt: "",
    itemPrompt: ""
};
const SurveySummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kSurveySummariser,
    systemPrompt: "",
    itemPrompt: ""
};
const TestForSummariseFailPersona = {
    name: IPromptPersona_1.EPromptPersona.kTestForSummariseFail,
    systemPrompt: "",
    itemPrompt: ""
};
const ClassifierPersona = {
    name: IPromptPersona_1.EPromptPersona.kClassifier,
    systemPrompt: "",
    itemPrompt: ""
};
const ThemeFinderPersona = {
    name: IPromptPersona_1.EPromptPersona.kThemeFinder,
    systemPrompt: "",
    itemPrompt: ""
};
const DeveloperQuestionGeneratorPersona = {
    name: IPromptPersona_1.EPromptPersona.kDeveloperQuestionGenerator,
    systemPrompt: "",
    itemPrompt: ""
};
const DeveloperImaginedAnswerGeneratorPersona = {
    name: IPromptPersona_1.EPromptPersona.kDeveloperImaginedAnswerGenerator,
    systemPrompt: "",
    itemPrompt: ""
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
    switch (persona) {
        case IPromptPersona_1.EPromptPersona.kSurveySummariser:
            const surveyTemplate = SurveySummariserPersona;
            surveyTemplate.systemPrompt = "You are an AI asistant that summarises survey responses in "
                + wordString +
                " words or less, to explain it to the management team that issues the survey. Please summarise the following survey result in "
                + wordString + " words. Make each distinct point a separate paragraph.";
            surveyTemplate.itemPrompt = userPrompt;
            return surveyTemplate;
        case IPromptPersona_1.EPromptPersona.kCodeSummariser:
            const codeTemplate = CodeSummariserPersona;
            codeTemplate.systemPrompt = "You are an AI asistant that summarises code in "
                + wordString +
                " words or less, to help explain the code it to new developers. Please summarise the following code in "
                + wordString + " words. Make each distinct point a separate paragraph. List the important classes or functions in the module";
            codeTemplate.itemPrompt = userPrompt;
            return codeTemplate;
        case IPromptPersona_1.EPromptPersona.kC4Diagrammer:
            const c4Template = C4DiagrammerPersona;
            c4Template.systemPrompt = "You are an AI asistant that generates a diagram in mermaid format from a description of a software system "
                + "to help explain the system to new developers.";
            c4Template.itemPrompt = userPrompt;
            return c4Template;
        case IPromptPersona_1.EPromptPersona.kTestForSummariseFail:
            const testForSummariseFailTemplate = TestForSummariseFailPersona;
            testForSummariseFailTemplate.systemPrompt = "You are an AI asistant that reviews the work of a summariser. The summariser occasionally cannot find the main body of the text to summarise. The summariser may apologise for this, or may say there is not enough relevant information to summarise, or may state the text contains only web page navigation, all of which are failed summaries."
                + " Please review the following summary and reply 'No' if the summariser has not been able to create a good summary of a body of text, otherwise reply 'Yes'.";
            testForSummariseFailTemplate.itemPrompt = userPrompt;
            return testForSummariseFailTemplate;
        case IPromptPersona_1.EPromptPersona.kClassifier:
            const classifierTemplate = ClassifierPersona;
            classifierTemplate.systemPrompt = "You are an asistant that can classify text into one of the following subjects: "
                + promptParam1 + "."
                + "Try to classify the subject of the following text. The classification is a single word from the list "
                + promptParam1
                + ". If you cannot classify it well, answer 'Unknown'.";
            classifierTemplate.itemPrompt = userPrompt;
            return classifierTemplate;
        case IPromptPersona_1.EPromptPersona.kThemeFinder:
            const themeFinderTemplate = ThemeFinderPersona;
            themeFinderTemplate.systemPrompt = "You are an AI asistant that finds a common theme from a number of paragraphs of text in "
                + wordString + " words or less. Please find the most common theme in the following text in "
                + wordString + " words. Do not start your reply with the phrase 'The most common theme in the text is'. Translate to English if necessary. ";
            themeFinderTemplate.itemPrompt = userPrompt;
            return themeFinderTemplate;
        case IPromptPersona_1.EPromptPersona.kDeveloperQuestionGenerator:
            const developerQuestionGeneratorTemplate = DeveloperQuestionGeneratorPersona;
            developerQuestionGeneratorTemplate.systemPrompt = "You are an AI asistant that generates a question after a developer has read an article about AI. The question is a single sentence of no more than 10 words. The question is one that the developer might ask as a follow up to reading the article. The question must be about generative AI or LLMs.";
            developerQuestionGeneratorTemplate.itemPrompt = userPrompt;
            return developerQuestionGeneratorTemplate;
        case IPromptPersona_1.EPromptPersona.kDeveloperAssistant:
            const developerAssistantTemplate = DeveloperAssistantPersona;
            developerAssistantTemplate.systemPrompt = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You limit replies to "
                + wordString + " words or less. If you don't know the answer, say 'I don't know'. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.";
            developerAssistantTemplate.itemPrompt = userPrompt;
            return developerAssistantTemplate;
        case IPromptPersona_1.EPromptPersona.kDeveloperImaginedAnswerGenerator:
            const developerImaginedAnswerGeneratorTemplate = DeveloperImaginedAnswerGeneratorPersona;
            developerImaginedAnswerGeneratorTemplate.systemPrompt = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You will be provided with a question about building applications that use generative AI technology. Write a "
                + wordString + " word summary of an article that would be a great answer to the question. Enrich the summary with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n";
            developerImaginedAnswerGeneratorTemplate.itemPrompt = userPrompt;
            return developerImaginedAnswerGeneratorTemplate;
        case IPromptPersona_1.EPromptPersona.kArticleSummariser:
            const articleTemplate = ArticleSummariserPersona;
            articleTemplate.systemPrompt = "You are an AI asistant that summarises text in "
                + wordString +
                " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text.  Translate to English if necessary. Make each distinct point a separate paragraph.";
            articleTemplate.itemPrompt = userPrompt;
            return ArticleSummariserPersona;
        case IPromptPersona_1.EPromptPersona.kArticleContextSummariser:
            const articleContextTemplate = ArticleContextSummariserPersona;
            articleContextTemplate.systemPrompt = "You are an AI asistant that summarises text in "
                + wordString +
                " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Translate to English if necessary. Make each distinct point a separate paragraph.";
            articleContextTemplate.itemPrompt = userPrompt;
            return ArticleContextSummariserPersona;
        default:
            const defaultTemplate = DefaultPersona;
            defaultTemplate.systemPrompt = "You are an AI asistant that provides assistance to developers building AI with Python. You provide concise answers of 50 words or less.";
            defaultTemplate.itemPrompt = userPrompt;
            return DefaultPersona;
    }
}
//# sourceMappingURL=IPromptPersonaFactory.js.map