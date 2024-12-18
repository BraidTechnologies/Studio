"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSummariserPersona = exports.ArticleSummariserPersona = void 0;
const IPromptPersona_1 = require("./IPromptPersona");
exports.ArticleSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kArticleSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
exports.CodeSummariserPersona = {
    name: IPromptPersona_1.EPromptPersona.kCodeSummariser,
    systemPrompt: "",
    itemPrompt: ""
};
//# sourceMappingURL=PromptPersona.js.map