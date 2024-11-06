"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
// Implementation of the Fluid connection API
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
exports.FluidClientProps = exports.FluidConnectionConfig = exports.FluidTokenProvider = void 0;
const IEnvironment_1 = require("./IEnvironment");
const FluidApi_1 = require("./FluidApi");
const Errors_1 = require("./Errors");
const IEnvironmentFactory_1 = require("./IEnvironmentFactory");
/**
 * Token Provider implementation for connecting to an Azure Function endpoint for
 * Azure Fluid Relay token resolution.
 */
class FluidTokenProvider {
    /**
     * Creates a new instance using configuration parameters.
     * @param environment The environment settings to be used.
     * @param sessionKey The session key for authentication
     * @param user - User object
     */
    constructor(environment, sessionKey, user) {
        this._api = new FluidApi_1.FluidApi(environment, sessionKey);
        this._user = user;
    }
    fetchOrdererToken(tenantId, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                jwt: yield this.getToken(tenantId, documentId),
            };
        });
    }
    fetchStorageToken(tenantId, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                jwt: yield this.getToken(tenantId, documentId),
            };
        });
    }
    getToken(tenantId, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let local = false;
            if (tenantId === "local")
                local = true;
            let request = {
                local: local,
                userId: this._user.userId,
                userName: this._user.userName,
                documentId: documentId ? documentId : ""
            };
            console.log("Requesting token for:" + JSON.stringify(request) + " tenantId:" + tenantId);
            const response = yield this._api.generateToken(request);
            if (!response)
                throw new Errors_1.ConnectionError("Unable to generate Fluid Token");
            return response;
        });
    }
}
exports.FluidTokenProvider = FluidTokenProvider;
class FluidConnectionConfig {
    /**
     * Creates a new instance using configuration parameters.
     * @param sessionKey The session key for authentication
     * @param tokenRequest - Details to request a token
     * @param forceProduction - boolean, if true then connect to production else default
     */
    constructor(sessionKey, tokenRequest, forceProduction) {
        this.documentId = "";
        let environment = (0, IEnvironmentFactory_1.getDefaultFluidEnvironment)();
        if (forceProduction)
            environment = (0, IEnvironmentFactory_1.getEnvironment)(IEnvironment_1.EEnvironment.kProduction);
        if (environment.name === IEnvironment_1.EEnvironment.kLocal)
            this.type = "local";
        else
            this.type = "remote";
        this.tenantId = environment.fluidTenantId();
        this.endpoint = environment.fluidApi();
        if (tokenRequest.documentId)
            this.documentId = tokenRequest.documentId;
        this.tokenProvider = new FluidTokenProvider(environment, sessionKey, tokenRequest);
    }
}
exports.FluidConnectionConfig = FluidConnectionConfig;
;
class FluidClientProps {
    /**
     * Creates a new instance using configuration parameters.
     * @param sessionKey The session key for authentication
     * @param tokenRequest - Details to request a token
     * @param forceProduction - boolean, if true then connect to production else default
     */
    constructor(sessionKey, tokenRequest, forceProduction) {
        this.connection = new FluidConnectionConfig(sessionKey, tokenRequest, forceProduction);
    }
}
exports.FluidClientProps = FluidClientProps;
;
//# sourceMappingURL=FluidTokenProvider.js.map