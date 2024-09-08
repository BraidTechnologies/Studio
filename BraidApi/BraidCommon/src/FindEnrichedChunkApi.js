"use strict";
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
exports.FindEnrichedChunkApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = require("axios");
class FindEnrichedChunkApi {
    constructor(environemnt_, sessionKey_) {
        this._environment = environemnt_;
        this._sessionKey = sessionKey_;
    }
    findForUrl(urlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this._environment.findEnrichedChunksRelevantToUrl() + "?session=" + this._sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, {
                    data: urlQuery
                });
                if (response.status === 200) {
                    return true;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return false;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return false;
            }
        });
    }
    findForSummary(urlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this._environment.findEnrichedChunksRelevantToSummary() + "?session=" + this._sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, {
                    data: urlQuery
                });
                if (response.status === 200) {
                    return true;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return false;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return false;
            }
        });
    }
}
exports.FindEnrichedChunkApi = FindEnrichedChunkApi;
//# sourceMappingURL=FindEnrichedChunkApi.js.map