// Copyright (c) 2024 Braid Technologies Ltd

// Internal import
import { ActivityRecord } from './ActivityRecord';

export interface IActivityRepository {

   save (record : ActivityRecord) : Promise<boolean>;
   loadRecentUrlActivity (count : number) : Promise<Array<ActivityRecord>>;
   loadRecentMessages (count : number) : Promise<Array<ActivityRecord>>;  
   removeMessageRecord (messageId: string) : Promise<boolean>;
}


