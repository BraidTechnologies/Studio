// Copyright (c) 2024 Braid Technologies Ltd
import { IFluidContainer, ConnectionState } from "fluid-framework";
import { AzureClient } from "@fluidframework/azure-client";

import { FluidClientProps } from "../../CommonTs/src/FluidTokenProvider";
import { IFluidTokenRequest } from "../../CommonTs/src/Fluid";
import { throwIfUndefined } from "./Asserts";
import { logApiError } from "./Logging";
import { ConnectionError, InvalidOperationError, InvalidStateError} from './Errors';
import { Interest } from './NotificationFramework';
import { SessionKey, ConversationKey } from "./Keys";
import { EConfigStrings } from "./ConfigStrings";
import { getDefaultFluidEnvironment } from "../../CommonTs/src/IEnvironmentFactory";
import { EEnvironment } from "../../CommonTs/src/IEnvironment";

let documentUuid = "b03724b3-4be0-4491-b0fa-43b01ab80d50";

export abstract class FluidConnection {

   public static connectedNotificationId = "connected";
   public static connectedInterest = new Interest(FluidConnection.connectedNotificationId);

   _client: AzureClient | undefined;
   _container: IFluidContainer | undefined;

   constructor() {

      this._client = undefined;
      this._container = undefined;
   }

   async createNew(sessionKey_: SessionKey, forceProduction: boolean): Promise<ConversationKey> {

      try {
         this.setupBeforeConnection (sessionKey_, forceProduction);

         throwIfUndefined (this._client);
         const { container, services } = await this._client.createContainer(this.schema(), "2");
         this._container = container;

         let self = this;

         return new Promise<ConversationKey>((resolve, reject) => {
            // Attach container to service and return assigned ID
            const containerIdPromise = container.attach();

            containerIdPromise.then((containerId) => {
               if (this._container) {
                  self.setupAfterConnection(this._container);
               }
               else {
                  logApiError ("FluidConnection is in inconsistent internal state.", null);
                  throw new InvalidStateError("FluidConnection is in inconsistent internal state.");
               }

               resolve (new ConversationKey (containerId));
            }).catch((e: any) => {
               logApiError ("Error connecting to conversation: ", e);               
               reject ();
            });
         });
      }
      catch (e: any) {
         throw new ConnectionError("Error connecting new container to remote data service: " + e ? e.message : "(no details found)");
      }
   }

   async attachToExisting(sessionKey_: SessionKey, conversationKey_: ConversationKey, forceProduction: boolean): Promise<ConversationKey> {

      try {
         this.setupBeforeConnection (sessionKey_, forceProduction);

         throwIfUndefined (this._client);
         const { container, services } = await this._client.getContainer(conversationKey_.toString(), this.schema(), "2");
         this._container = container;

         this.setupAfterConnection(this._container);

         return conversationKey_;
      }
      catch (e: any) {
         throw new ConnectionError("Error attaching existing container to remote data service: " + e ? e.message : "(no details found)")
      }
   }

   canDisconnect(): boolean {

      if (!this._container)
         return false;

      var state = this._container.connectionState;
      if (state !== ConnectionState.Connected)
         return false;

      return true;
   }

   isConnected (): boolean {

      return this.canDisconnect();
   }

   async disconnect(): Promise<boolean> {

      if (this.canDisconnect()) {
         if (this._container) {
            await this._container.disconnect();
            this.disconnectLocalCaucuses();
         }

         return true;
      }
      else {
         throw new InvalidOperationError("The remote data service is not connected.")
      }
   }

   // local function to cut down duplication between createNew() and AttachToExisting())
   private setupBeforeConnection(sessionKey_: SessionKey, forceProduction: boolean): void {

      let local = getDefaultFluidEnvironment().name === EEnvironment.kLocal;

      let request: IFluidTokenRequest = {
         local: local,         
         userId: EConfigStrings.kLLMGuid,
         userName: EConfigStrings.kLLMName,
         documentId: documentUuid         
      }

      var clientProps: FluidClientProps = new FluidClientProps(sessionKey_.toString(), request, forceProduction);
      this._client = new AzureClient(clientProps);
   }

   // local function to cut down duplication between createNew() and AttachToExisting())
   private setupAfterConnection(container: IFluidContainer): void {

      // Create caucuses so they exist when observers are notified of connection
      this.setupLocalCaucuses (container.initialObjects);
   }

   abstract schema() : any;
   abstract setupLocalCaucuses(initialObjects: any) : void;
   abstract disconnectLocalCaucuses () : void;
}



