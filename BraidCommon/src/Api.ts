// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IEnvironment } from "./IEnvironment";

/**
 * Represents an API class that interacts with the specified environment using the provided session key.
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
