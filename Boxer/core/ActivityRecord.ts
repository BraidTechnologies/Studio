// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module ActivityRecord
 * @description Defines interfaces and utilities for storing user activity records in Braid.
 * 
 * This module provides interfaces for different types of activity records that can be stored:
 * - Base activity records (IStoredActivity)
 * - URL-based activities (IStoredUrlActivity) 
 * - URL like/unlike activities (IStoredLikeUrlActivity)
 * - Message-based activities (IStoredMessageActivity)
 * 
 * Each interface extends IStorable for persistence and includes version information via
 * className and schemaNumber constants. The module also provides utility functions for
 * handling dates in UTC format for consistent storage.
 */

import { IStorable } from '../../CommonTs/src/IStorable';

export const activityRecordClassName = "IStoredActivity";
export const activityRecordSchemaNumber = 1;

// ActivityRecord - has several derived classes according to different activity types. 
export interface IStoredActivity extends IStorable {

}

export const urlActivityRecordClassName = "IStoredUrlActivity";
export const urlActivityRecordSchemaNumber = "1";

// ActivityRecord - activity details plus the URL they clicked on 
export interface IStoredUrlActivity extends IStoredActivity {
   
   url: string;
}

export const urlLikeActivityRecordClassName = "IStoredLikeUrlActivity";
export const urlLikeActivityRecordSchemaNumber = "1";

// ActivityRecord - URL activity details plus a flag to say like (unlike if false) 
export interface IStoredLikeUrlActivity extends IStoredUrlActivity {
   
   like: boolean;
}

export const messageActivityRecordClassName = "IStoredMessageActivity";
export const messageActivityRecordSchemaNumber = "1";

// ActivityRecord - activity details plus the URL they clicked on 
export interface IStoredMessageActivity extends IStoredActivity {
   
   message: string;
}

export function makeDateUTC(rhs: Date) : Date {
   let d = new Date (rhs);
   d.setMilliseconds(0); // MSecs are not used in UTC, and Cosmos DB recommends UTC
   return d;
}
