// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import { SessionKey } from "./Keys";
import { IActivityRepository } from "./IActivityRepository";
import { ActivityRepositoryMongo } from "./ActivityRepositoryMongo";
import { ActivityRepositoryCosmos } from "./ActivityRepositoryCosmos";

export function getRecordRepository (sessionKey_: SessionKey) : IActivityRepository {
   return new ActivityRepositoryCosmos(sessionKey_);   
}


