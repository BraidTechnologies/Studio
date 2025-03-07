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
(0, mocha_1.describe)("Chunk Driver", function () {
    return __awaiter(this, void 0, void 0, function* () {
        (0, mocha_1.it)("Needs to provide default model", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getDefaultTextChunker)();
                (0, expect_1.expect)(model.drivenModelProvider.length > 0).toBe(true);
                (0, expect_1.expect)(model.defaultChunkSize > 0).toBe(true);
            });
        });
        (0, mocha_1.it)("Needs to provide specific model", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kOpenAI);
                (0, expect_1.expect)(model.drivenModelProvider.length > 0).toBe(true);
                (0, expect_1.expect)(model.defaultChunkSize > 0).toBe(true);
                (0, expect_1.expect)(model.drivenModelType).toEqual(IModelDriver_1.EModel.kLarge);
            });
        });
        (0, mocha_1.it)("Needs to chunk small text", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kSmall, IModelDriver_1.EModelProvider.kOpenAI);
                let text = "small text";
                (0, expect_1.expect)(model.fitsInDefaultChunk(text)).toBe(true);
            });
        });
        (0, mocha_1.it)("Needs to chunk large text", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kSmall, IModelDriver_1.EModelProvider.kOpenAI);
                let text = "small text";
                for (let i = 0; i < 12; i++)
                    text = text + text;
                (0, expect_1.expect)(model.fitsInDefaultChunk(text)).toBe(false);
            });
        });
        (0, mocha_1.it)("Needs to chunk small text", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kSmall, IModelDriver_1.EModelProvider.kOpenAI);
                let text = "small text";
                (0, expect_1.expect)(model.chunkText(text, undefined, undefined).length).toBe(1);
            });
        });
        (0, mocha_1.it)("Needs to chunk large text", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kSmall, IModelDriver_1.EModelProvider.kOpenAI);
                let text = "small text ";
                for (let i = 0; i < 12; i++)
                    text = text + text;
                (0, expect_1.expect)(model.chunkText(text, undefined, undefined).length > 1).toBe(true);
            });
        });
        (0, mocha_1.it)("Needs to chunk large text with overlaps", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kSmall, IModelDriver_1.EModelProvider.kOpenAI);
                let text = "small text ";
                for (let i = 0; i < 12; i++)
                    text = text + text;
                let baseLength = model.chunkText(text, undefined, undefined).length;
                let overlappedLength = model.chunkText(text, undefined, 2048).length;
                (0, expect_1.expect)(overlappedLength > baseLength).toBe(true);
            });
        });
        (0, mocha_1.it)("Needs to provide DeepSeek compatible model", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let model = (0, IModelFactory_1.getTextChunker)(IModelDriver_1.EModel.kLarge, IModelDriver_1.EModelProvider.kDeepSeek);
                (0, expect_1.expect)(model.drivenModelProvider.length > 0).toBe(true);
                (0, expect_1.expect)(model.defaultChunkSize > 0).toBe(true);
                (0, expect_1.expect)(model.drivenModelType).toEqual(IModelDriver_1.EModel.kReasoning);
            });
        });
    });
});
//# sourceMappingURL=chunkdriver.test.js.map