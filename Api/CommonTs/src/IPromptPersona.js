"use strict";
// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module IPromptPersona
 * @description Defines interfaces and enums for managing different prompt personas.
 *
 * This module provides the core types for configuring different AI prompt personas,
 * each specialized for specific summarization tasks. It includes:
 * - EPromptPersona enum for different persona types (Article, Code, Survey)
 * - IPromptPersona interface defining the structure of a prompt persona
 *
 * Each persona contains configuration for system-level and item-level prompting,
 * allowing for specialized behavior across different summarization contexts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPromptPersona = void 0;
var EPromptPersona;
(function (EPromptPersona) {
    EPromptPersona["kDefault"] = "Default";
    EPromptPersona["kArticleSummariser"] = "ArticleSummariser";
    EPromptPersona["kArticleContextSummariser"] = "ArticleContextSummariser";
    EPromptPersona["kCodeSummariser"] = "CodeSummariser";
    EPromptPersona["kC4Diagrammer"] = "C4Diagrammer";
    EPromptPersona["kSurveySummariser"] = "SurveySummariser";
    EPromptPersona["kTestForSummariseFail"] = "TestForSummariseFail";
    EPromptPersona["kClassifier"] = "Classifier";
    EPromptPersona["kThemeFinder"] = "ThemeFinder";
    EPromptPersona["kDeveloperAssistant"] = "DeveloperAssistant";
    EPromptPersona["kDeveloperImaginedAnswerGenerator"] = "DeveloperImaginedAnswerGenerator";
    EPromptPersona["kDeveloperQuestionGenerator"] = "DeveloperQuestionGenerator";
})(EPromptPersona || (exports.EPromptPersona = EPromptPersona = {}));
;
//# sourceMappingURL=IPromptPersona.js.map