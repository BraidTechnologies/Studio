"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionEnvironment = exports.StagingEnvironment = exports.DevelopmentEnvironment = void 0;
/**
 * DevelopmentEnvironment class that implements the IEnvironment interface.
 * Provides methods to retrieve URLs for checking session, summarizing, and classifying APIs.
 */
class DevelopmentEnvironment {
    checkSessionApi() {
        return "http://localhost:7071/api/CheckSession";
    }
    summariseApi() {
        return "http://localhost:7071/api/Summarize";
    }
    classifyApi() {
        return "http://localhost:7071/api/Classify";
    }
    embedApi() {
        return "http://localhost:7071/api/Embed";
    }
    saveActivityApi() {
        return "http://localhost:7071/api/SaveActivity";
    }
}
exports.DevelopmentEnvironment = DevelopmentEnvironment;
/**
 * StagingEnvironment class that implements the IEnvironment interface.
 * Provides methods to retrieve URLs for checking session, summarizing, and classifying APIs.
 */
class StagingEnvironment {
    checkSessionApi() {
        return "https://braidapi.azurewebsites.net/api/CheckSession";
    }
    summariseApi() {
        return "https://braidapi.azurewebsites.net/api/Summarize";
    }
    classifyApi() {
        return "https://braidapi.azurewebsites.net/api/Classify";
    }
    embedApi() {
        return "https://braidapi.azurewebsites.net/api/Embed";
    }
    saveActivityApi() {
        return "https://braidapi.azurewebsites.net/api/SaveActivity";
    }
}
exports.StagingEnvironment = StagingEnvironment;
/**
 * ProductionEnvironment class that implements the IEnvironment interface.
 * Provides methods to retrieve URLs for checking session, summarizing, and classifying APIs.
 */
class ProductionEnvironment {
    checkSessionApi() {
        return "https://braidapi.azurewebsites.net/api/CheckSession";
    }
    summariseApi() {
        return "https://braidapi.azurewebsites.net/api/Summarize";
    }
    classifyApi() {
        return "https://braidapi.azurewebsites.net/api/Classify";
    }
    embedApi() {
        return "https://braidapi.azurewebsites.net/api/Embed";
    }
    saveActivityApi() {
        return "https://braidapi.azurewebsites.net/api/SaveActivity";
    }
}
exports.ProductionEnvironment = ProductionEnvironment;
//# sourceMappingURL=Environment.js.map