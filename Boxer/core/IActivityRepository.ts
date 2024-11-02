// Copyright (c) 2024 Braid Technologies Ltd

// Internal import
import { IStoredActivity } from './ActivityRecord';

export interface IActivityRepository {

   save (record : IStoredActivity) : Promise<boolean>;
   loadRecentUrlActivity (count : number) : Promise<Array<IStoredActivity>>;
   loadRecentMessages (count : number) : Promise<Array<IStoredActivity>>;  
   removeMessageRecord (messageId: string) : Promise<boolean>;
}


