'use strict';
// Copyright Braid Technologies Ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { AzureClient } from "@fluidframework/azure-client";
import { ContainerSchema } from "fluid-framework";
import { SharedString } from "fluid-framework/legacy";

import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { FluidApi } from '../../BraidCommon/src/FluidApi'
import { IFluidTokenRequest } from '../../BraidCommon/src/Fluid';
import { FluidClientProps } from '../../BraidCommon/src/FluidTokenProvider'

declare var process: any;

const schema : ContainerSchema = {
   initialObjects: {
      test: SharedString
   }
};

let documentUuid = "b03724b3-4be0-4491-b0fa-43b01ab80d50";

async function sleep(ms: number): Promise<void> {
   return new Promise(
       (resolve) => setTimeout(resolve, ms));
}

describe("Generate Fluid Token", async function () {

   it("Needs to fail if session key is incorrect", async function () {
  
      let environment = getEnvironment(EEnvironment.kLocal);

      let request: IFluidTokenRequest = {
         local: true,         
         documentId: "madeupdocument",
         userId: "madeup user Id",
         userName: "User"
      }

      let fluidApi = new FluidApi (environment, "thiswillfail");

      let token = await fluidApi.generateToken(request);      

      expect (typeof token).toBe ('undefined') ;     

   }).timeout(20000);


   it("Needs to return a valid token if session key is correct", async function () {
  
      let environment = getEnvironment(EEnvironment.kLocal);
      let token : string | undefined = "";

      let request: IFluidTokenRequest = {
         local: true,         
         userId: "madeup user Id",
         userName: "User",
         documentId: documentUuid         
      }

      let fluidApi = new FluidApi (environment, process.env.SessionKey.toString());

      token = await fluidApi.generateToken(request);
  
      expect (token && token.length > 0).toBe (true);    

   }).timeout(20000);

   it("Needs to return a valid token from production if session key is correct", async function () {
  
      let environment = getEnvironment(EEnvironment.kProduction);
      let token : string | undefined = "";

      let request: IFluidTokenRequest = {
         local: false,         
         userId: "madeup user Id",
         userName: "User",
         documentId: documentUuid         
      }

      let fluidApi = new FluidApi (environment, process.env.SessionKey.toString());

      token = await fluidApi.generateToken(request);
  
      expect (token && token.length > 0).toBe (true);    

   }).timeout(20000);   

   it("Needs to connect to a Fluid container.", async function () {

      let session = process.env.SessionKey.toString();

      let user: IFluidTokenRequest = {
         local: true,
         userId: "madeup user Id",
         userName: "User",
         documentId: documentUuid
      }

      let clientProps: FluidClientProps = new FluidClientProps(session, user, false);
      let client = new AzureClient(clientProps);   

      const { container: containerNew, services: servicesNew } = await client.createContainer(schema as any, "2");

      // Attach container to service and return assigned ID
      const containerId = await containerNew.attach();

      containerNew.initialObjects.test = "Hello";

      await sleep (2500);
      
      const { container: containerExisting, services: servicesExisting } = await client.getContainer(containerId, schema as any, "2");

      await sleep (2500);

      let read = (containerExisting.initialObjects.test as SharedString).getText();

      containerExisting.initialObjects.test = "Goodbye";

      containerNew.dispose();
      containerExisting.dispose();  


   }).timeout(20000);
 

});