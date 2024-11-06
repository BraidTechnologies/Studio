// Copyright (c) 2024 Braid Technologies Ltd

import { IStorable } from '../../CommonTs/src/IStorable';

export const activityRecordClassName = "IStoredActivity";
export const activityRecordSchemaNumber = 1;

// ActivityRecord - has several derived classes according to different activity types. 
export interface IStoredActivity extends IStorable {

}

export const urlActivityRecordClassName = "IStoredUrlActivity";
export const urlActivityRecordSchemaNumber = 1;

// ActivityRecord - activity details plus the URL they clicked on 
export interface IStoredUrlActivity extends IStoredActivity {
   
   url: string;
}

export const urlLikeActivityRecordClassName = "IStoredLikeUrlActivity";
export const urlLikeActivityRecordSchemaNumber = 1;

// ActivityRecord - URL activity details plus a flag to say like (unlike if false) 
export interface IStoredLikeUrlActivity extends IStoredUrlActivity {
   
   like: boolean;
}

export const messageActivityRecordClassName = "IStoredMessageActivity";
export const messageActivityRecordSchemaNumber = 1;

// ActivityRecord - activity details plus the URL they clicked on 
export interface IStoredMessageActivity extends IStoredActivity {
   
   message: string;
}

export function makeDateUTC(rhs: Date) : Date {
   let d = new Date (rhs);
   d.setMilliseconds(0); // MSecs are not used in UTC, and Cosmos DB recommends UTC
   return d;
}
