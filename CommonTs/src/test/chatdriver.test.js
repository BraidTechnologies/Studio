'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright Braid Technologies Ltd, 2024
const expect_1 = require("expect");
const mocha_1 = require("mocha");
const IModelDriver_1 = require("../../CommonTs/src/Interfaces/IModelDriver");
const IModelFactory_1 = require("../../CommonTs/src/Interfaces/IModelFactory");
const dist_1 = require("promptmanager/dist");
(0, mocha_1.describe)("Chat Driver", function () {
    (0, mocha_1.it)("Needs pass a single line prompt", function () {
        let driver1 = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kOpenAI);
        let driver2 = (0, IModelFactory_1.getDefaultChatModelDriver)();
        (0, expect_1.expect)(driver1.drivenModelType).toEqual(driver2.drivenModelType);
    });
    (0, mocha_1.it)("Needs pass a single line prompt", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kOpenAI);
            let prompt = { prompt: "Hi, how are you?", history: [] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            (0, expect_1.expect)(response.content.length > 0).toEqual(true);
        });
    }).timeout(10000);
    (0, mocha_1.it)("Needs to pass a multi line prompt", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kOpenAI);
            let prompt = { prompt: "What time did I say it was?",
                history: [{ role: IModelDriver_1.EModelConversationRole.kUser, content: "It is 10:30" }] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            (0, expect_1.expect)(response.content.includes("10:30")).toEqual(true);
        });
    }).timeout(10000);
    (0, mocha_1.it)("Needs to pass a small  model", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kSmall, IModelDriver_1.EModelProvider.kOpenAI);
            let prompt = { prompt: "What time did I say it was?",
                history: [{ role: IModelDriver_1.EModelConversationRole.kUser, content: "It is 10:30" }] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            (0, expect_1.expect)(response.content.includes("10:30")).toEqual(true);
            (0, expect_1.expect)(driver.drivenModelType).toEqual(IModelDriver_1.EModel.kSmall);
        });
    }).timeout(10000);
    (0, mocha_1.it)("Needs to pass a single line prompt with o1", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kReasoning, IModelDriver_1.EModelProvider.kOpenAI);
            let prompt = { prompt: "Hi, how are you?", history: [] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            (0, expect_1.expect)(response.content.length > 0).toEqual(true);
        });
    }).timeout(10000);
    (0, mocha_1.it)("Needs to pass a multi line prompt with o1", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kReasoning, IModelDriver_1.EModelProvider.kOpenAI);
            let prompt = { prompt: "What time did I say it was?",
                history: [{ role: IModelDriver_1.EModelConversationRole.kUser, content: "It is 10:30" }] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            console.log(response.content);
            (0, expect_1.expect)(response.content.toLowerCase().includes("10:30")).toEqual(true);
        });
    }).timeout(10000);
    (0, mocha_1.it)("Needs to pass a single line prompt with DeepSeek", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kDeepSeek);
            let prompt = { prompt: "Hi, how are you?", history: [] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            (0, expect_1.expect)(response.content.length > 0).toEqual(true);
        });
    }).timeout(10000);
    (0, mocha_1.it)("Needs to pass a multi line prompt with DeepSeek", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let driver = (0, IModelFactory_1.getChatModelDriver)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kDeepSeek);
            let prompt = { prompt: "What time did I say it was?",
                history: [{ role: IModelDriver_1.EModelConversationRole.kUser, content: "It is 10:30" }] };
            let response = yield driver.generateResponse(dist_1.EPromptPersona.kDefault, prompt, { wordTarget: 100 });
            console.log(response.content);
            (0, expect_1.expect)(response.content.toLowerCase().includes("10:30")).toEqual(true);
        });
    }).timeout(10000);
});
//# sourceMappingURL=chatdriver.test.js.map