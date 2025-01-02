// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module IActivityRepositoryFactory
 * @description Provides factory function for creating activity repositories.
 * 
 * This module includes the getRecordRepository function which creates and returns
 * an IActivityRepository implementation based on the provided session key. Currently
 * returns a Cosmos DB-backed implementation of the activity repository.
 */

// Internal imports
import { SessionKey } from "./Keys";
import { IActivityRepository } from "./IActivityRepository";
import { ActivityRepositoryCosmos } from "./ActivityRepository";

export function getRecordRepository (sessionKey_: SessionKey) : IActivityRepository {
   return new ActivityRepositoryCosmos(sessionKey_);   
}


