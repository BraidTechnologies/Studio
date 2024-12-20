/**
 * @module FluidTokenProvider
 * @description Provides token management and connection configuration for Azure Fluid Relay services.
 * 
 * This module implements the necessary components to establish and manage connections
 * to Azure Fluid Relay, including:
 * - Token generation and management via FluidTokenProvider
 * - Connection configuration via FluidConnectionConfig
 * - Client properties setup via FluidClientProps
 * 
 * The implementation supports both local and remote environments, with configurable
 * authentication through session keys and user contexts.
 */

// Copyright (c) 2024 Braid Technologies Ltd
// Implementation of the Fluid connection API

import { AzureRemoteConnectionConfig, AzureClientProps, ITokenProvider, ITokenResponse } from "@fluidframework/azure-client";

import { IEnvironment, EEnvironment } from "./IEnvironment";
import { FluidApi } from "./FluidApi";
import { IFluidUser, IFluidTokenRequest } from "./Fluid";
import { ConnectionError } from "./Errors";
import { getDefaultFluidEnvironment, getEnvironment } from "./IEnvironmentFactory";

/**
 * Token Provider implementation for connecting to an Azure Function endpoint for
 * Azure Fluid Relay token resolution.
 */
export class FluidTokenProvider implements ITokenProvider {
   
   private _api: FluidApi;
   private _user: IFluidUser;

   /**
    * Creates a new instance using configuration parameters.
    * @param environment The environment settings to be used.
    * @param sessionKey The session key for authentication 
    * @param user - User object
    */
   constructor(environment: IEnvironment, sessionKey: string, user: IFluidUser) {

      this._api = new FluidApi(environment, sessionKey);
      this._user = user;
   }

   public async fetchOrdererToken(tenantId: string, documentId?: string): Promise<ITokenResponse> {
      return {
         jwt: await this.getToken(tenantId, documentId),
      };
   }

   public async fetchStorageToken(tenantId: string, documentId: string): Promise<ITokenResponse> {
      return {
         jwt: await this.getToken(tenantId, documentId),
      };
   }

   private async getToken(tenantId: string, documentId: string | undefined): Promise<string> {

      let local = false;
      if (tenantId === "local")
         local = true;

      let request : IFluidTokenRequest = {
         local: local,
         userId: this._user.userId,
         userName: this._user.userName,
         documentId: documentId? documentId : ""
      }
      
      const response = await this._api.generateToken(request);
      if (!response)
         throw new ConnectionError("Unable to generate Fluid Token");
      return response;
   }
}

export class FluidConnectionConfig implements AzureRemoteConnectionConfig {

   tokenProvider: ITokenProvider; 
   endpoint: string;
   type: any;
   tenantId: string;
   documentId: string = "";

   /**
    * Creates a new instance using configuration parameters.
    * @param sessionKey The session key for authentication 
    * @param tokenRequest - Details to request a token
    * @param forceProduction - boolean, if true then connect to production else default
    */
   constructor(sessionKey: string, tokenRequest: IFluidTokenRequest, forceProduction: boolean) {

      let environment = getDefaultFluidEnvironment();
      if (forceProduction)
         environment = getEnvironment (EEnvironment.kProduction);

      if (environment.name === EEnvironment.kLocal)
         this.type = "local";
      else
         this.type = "remote";

      this.tenantId = environment.fluidTenantId();
      this.endpoint = environment.fluidApi();   
      if (tokenRequest.documentId)   
         this.documentId = tokenRequest.documentId;
      this.tokenProvider = new FluidTokenProvider (environment, sessionKey, tokenRequest);
   }
};

export class FluidClientProps implements AzureClientProps {
   connection: FluidConnectionConfig;

   /**
    * Creates a new instance using configuration parameters.
    * @param sessionKey The session key for authentication 
    * @param tokenRequest - Details to request a token
    * @param forceProduction - boolean, if true then connect to production else default
    */   
   constructor(sessionKey: string, tokenRequest: IFluidTokenRequest, forceProduction: boolean) {
      this.connection = new FluidConnectionConfig(sessionKey, tokenRequest, forceProduction);
   }
};
