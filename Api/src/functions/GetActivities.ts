'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

// Internal imports
import { isSessionValid, sessionFailResponse } from "./Utility";
import { throwIfUndefined } from "../../../CommonTs/src/Asserts";
import { IStorable, IStorableMultiQuerySpec } from "../../../CommonTs/src/IStorable";
import { makeStorablePostToken, makePostQueryHeader } from './CosmosRepositoryApi';
import {AzureLogger, activityStorableAttributes, saveStorable} from './CosmosStorableApi';


