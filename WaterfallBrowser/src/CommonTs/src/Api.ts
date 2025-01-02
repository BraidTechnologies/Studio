// Copyright (c) 2024 Braid Technologies Ltd

/**
 * @module Api
 * 
 * This module provides a base class for interacting with an API.
 * It includes common properties and methods for all API classes.
 */

import axios from 'axios';

import { IEnvironment } from "./IEnvironment";

/**
 * Represents an API class that interacts with the specified environment using the provided session key. 
 * This is a super class of each actual (useful) API. In itself it isn't very useful, it just holds common data. 
 * @param {IEnvironment} environemnt_ - The environment interface to interact with.
 * @param {string} sessionKey_ - The session key for authentication.
 */
export class Api {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environemnt_: IEnvironment, sessionKey_: string) {
      this._environment = environemnt_;
      this._sessionKey = sessionKey_;
   }  

   public get environment() : IEnvironment  {
      return this._environment;
   }
   public get sessionKey() : string  {
      return this._sessionKey;
   }   
}
