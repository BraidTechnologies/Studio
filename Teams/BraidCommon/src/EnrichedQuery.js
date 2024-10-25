"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Query API
Object.defineProperty(exports, "__esModule", { value: true });
exports.EStandardPrompts = exports.EConversationRole = void 0;
/**
 * Defines the structure of a conversation element.
 */
var EConversationRole;
(function (EConversationRole) {
    EConversationRole["kSystem"] = "system";
    EConversationRole["kAssistant"] = "assistant";
    EConversationRole["kUser"] = "user";
})(EConversationRole || (exports.EConversationRole = EConversationRole = {}));
;
/**
 * Enum representing standard prompts for an AI assistant helping an application developer understand generative AI.
 * Includes prompts for initial questions, enrichment, follow-up questions, and generating questions.
 * Each prompt provides specific instructions and limitations for the AI assistant's responses.
 */
var EStandardPrompts;
(function (EStandardPrompts) {
    EStandardPrompts["kOpenAiPersonaPrompt"] = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. If the question is not related to building AI applications, Python, or Large Language Models (LLMs),, say 'That doesn't seem to be about AI'.";
    EStandardPrompts["kEnrichmentPrompt"] = "You will be provided with a question about building applications that use generative AI technology. Write a 50 word summary of an article that would be a great answer to the question. Enrich the summary with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n";
    EStandardPrompts["kFollowUpPrompt"] = "You will be provided with a summary of an article about building applications that use generative AI technology. Write a question of no more than 10 words that a reader might ask as a follow up to reading the article.";
    EStandardPrompts["kFollowUpPrefix"] = "Article summary: ";
    EStandardPrompts["kGenerateAQuestionPrompt"] = "You are an AI assistant helping an application developer understand generative AI. Based on the dialog presented as context, generate a 10 word question that is relevant to the subjects being discussed.\n";
})(EStandardPrompts || (exports.EStandardPrompts = EStandardPrompts = {}));
;
//# sourceMappingURL=EnrichedQuery.js.map