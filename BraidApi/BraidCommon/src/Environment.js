"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionEnvironment = exports.StagingEnvironment = exports.DevelopmentEnvironment = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const IEnvironment_1 = require("./IEnvironment");
/**
 * Class representing the Development Environment with methods to retrieve various API endpoints.
 * @class DevelopmentEnvironment
 */
class DevelopmentEnvironment {
    constructor() {
        this.name = IEnvironment_1.EEnvironment.kLocal;
    }
    checkSessionApi() {
        return "http://localhost:7071/api/CheckSession";
    }
    summariseApi() {
        return "http://localhost:7071/api/Summarize";
    }
    findThemeApi() {
        return "http://localhost:7071/api/FindTheme";
    }
    classifyApi() {
        return "http://localhost:7071/api/Classify";
    }
    chunkApi() {
        return "http://localhost:7071/api/Chunk";
    }
    embedApi() {
        return "http://localhost:7071/api/Embed";
    }
    suppressSummariseFail() {
        return "http://localhost:7071/api/SuppressSummariseFail";
    }
    saveActivityApi() {
        return "http://localhost:7071/api/SaveActivity";
    }
    removeActivityApi() {
        return "http://localhost:7071/api/RemoveActivity";
    }
    getActivitiesApi() {
        return "http://localhost:7071/api/GetActivities";
    }
    loginWithLinkedInApi() {
        return "http://localhost:7071/api/LoginWithLinkedIn";
    }
    authFromLinkedInApi() {
        return "http://localhost:7071/api/ProcessAuthFromLinkedIn";
    }
    boxerHome() {
        return "http://localhost:1337/aibot.html";
    }
    findRelevantEnrichedChunksFromUrl() {
        return "http://localhost:7071/api/FindRelevantEnrichedChunksFromUrl";
    }
    findRelevantEnrichedChunksFromSummary() {
        return "http://localhost:7071/api/FindRelevantEnrichedChunksFromSummary";
    }
    findEnrichedChunkFromUrl() {
        return "http://localhost:7071/api/FindEnrichedChunkFromUrl";
    }
    queryModelWithEnrichment() {
        return "http://localhost:7071/api/QueryModelWithEnrichment";
    }
    generateQuestion() {
        return "http://localhost:7071/api/GenerateQuestion";
    }
    generateFluidToken() {
        return "http://localhost:7071/api/GenerateFluidToken";
    }
}
exports.DevelopmentEnvironment = DevelopmentEnvironment;
/**
 * Class representing the Staging Environment with methods to retrieve various API endpoints.
 * @class StagingEnvironment
 */
class StagingEnvironment {
    constructor() {
        this.name = IEnvironment_1.EEnvironment.kStaging;
    }
    checkSessionApi() {
        return "https://braidapi.azurewebsites.net/api/CheckSession";
    }
    summariseApi() {
        return "https://braidapi.azurewebsites.net/api/Summarize";
    }
    findThemeApi() {
        return "https://braidapi.azurewebsites.net/api/FindTheme";
    }
    classifyApi() {
        return "https://braidapi.azurewebsites.net/api/Classify";
    }
    chunkApi() {
        return "https://braidapi.azurewebsites.net/api/Chunk";
    }
    embedApi() {
        return "https://braidapi.azurewebsites.net/api/Embed";
    }
    suppressSummariseFail() {
        return "https://braidapi.azurewebsites.net/api/SuppressSummariseFail";
    }
    saveActivityApi() {
        return "https://braidapi.azurewebsites.net/api/SaveActivity";
    }
    removeActivityApi() {
        return "https://braidapi.azurewebsites.net/api/RemoveActivity";
    }
    getActivitiesApi() {
        return "https://braidapi.azurewebsites.net/api/GetActivities";
    }
    loginWithLinkedInApi() {
        return "https://braidapi.azurewebsites.net/api/LoginWithLinkedIn";
    }
    authFromLinkedInApi() {
        return "https://braidapi.azurewebsites.net/api/ProcessAuthFromLinkedIn";
    }
    boxerHome() {
        return "https://braidapps.io/aibot.html";
    }
    findRelevantEnrichedChunksFromUrl() {
        return "https://braidapi.azurewebsites.net/api/FindRelevantEnrichedChunksFromUrl";
    }
    findRelevantEnrichedChunksFromSummary() {
        return "https://braidapi.azurewebsites.net/api/FindRelevantEnrichedChunksFromSummary";
    }
    findEnrichedChunkFromUrl() {
        return "https://braidapi.azurewebsites.net/api/FindEnrichedChunkFromUrl";
    }
    queryModelWithEnrichment() {
        return "https://braidapi.azurewebsites.net/api/QueryModelWithEnrichment";
    }
    generateQuestion() {
        return "https://braidapi.azurewebsites.net/api/GenerateQuestion";
    }
    generateFluidToken() {
        return "https://braidapi.azurewebsites.net/api/GenerateFluidToken";
    }
}
exports.StagingEnvironment = StagingEnvironment;
/**
 * Class representing a Production Environment with methods to retrieve various API endpoints.
 * @class ProductionEnvironment
 */
class ProductionEnvironment {
    constructor() {
        this.name = IEnvironment_1.EEnvironment.kProduction;
    }
    checkSessionApi() {
        return "https://braidapi.azurewebsites.net/api/CheckSession";
    }
    summariseApi() {
        return "https://braidapi.azurewebsites.net/api/Summarize";
    }
    findThemeApi() {
        return "https://braidapi.azurewebsites.net/api/FindTheme";
    }
    classifyApi() {
        return "https://braidapi.azurewebsites.net/api/Classify";
    }
    chunkApi() {
        return "https://braidapi.azurewebsites.net/api/Chunk";
    }
    embedApi() {
        return "https://braidapi.azurewebsites.net/api/Embed";
    }
    suppressSummariseFail() {
        return "https://braidapi.azurewebsites.net/api/SuppressSummariseFail";
    }
    saveActivityApi() {
        return "https://braidapi.azurewebsites.net/api/SaveActivity";
    }
    removeActivityApi() {
        return "https://braidapi.azurewebsites.net/api/RemoveActivity";
    }
    getActivitiesApi() {
        return "https://braidapi.azurewebsites.net/api/GetActivities";
    }
    loginWithLinkedInApi() {
        return "https://braidapi.azurewebsites.net/api/LoginWithLinkedIn";
    }
    authFromLinkedInApi() {
        return "https://braidapi.azurewebsites.net/api/ProcessAuthFromLinkedIn";
    }
    boxerHome() {
        return "https://braidapps.io/aibot.html";
    }
    findRelevantEnrichedChunksFromUrl() {
        return "https://braidapi.azurewebsites.net/api/FindRelevantEnrichedChunksFromUrl";
    }
    findRelevantEnrichedChunksFromSummary() {
        return "https:/braidapi.azurewebsites.net/api/FindRelevantEnrichedChunksFromSummary";
    }
    findEnrichedChunkFromUrl() {
        return "https://braidapi.azurewebsites.net/api/FindEnrichedChunkFromUrl";
    }
    queryModelWithEnrichment() {
        return "https://braidapi.azurewebsites.net/api/QueryModelWithEnrichment";
    }
    generateQuestion() {
        return "https://braidapi.azurewebsites.net/api/GenerateQuestion";
    }
    generateFluidToken() {
        return "https://braidapi.azurewebsites.net/api/GenerateFluidToken";
    }
}
exports.ProductionEnvironment = ProductionEnvironment;
//# sourceMappingURL=Environment.js.map