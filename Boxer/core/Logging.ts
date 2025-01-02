// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module Logging
 * @description Provides a logging system for the Boxer application.
 * 
 * This module includes the logCoreError, logDbError, logApiError, and logApiInfo functions which log errors and information to the console.
 */

import { log, LogLevel, tag } from 'missionlog';
import { EConfigStrings } from './ConfigStrings';


 // Logging handler
 const logger = {
   [LogLevel.ERROR]: (tag, msg, params) => console.error(msg, ...params),
   [LogLevel.WARN]: (tag, msg, params) => console.warn(msg, ...params),
   [LogLevel.INFO]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.TRACE]: (tag, msg, params) => console.log(msg, ...params),
   [LogLevel.DEBUG]: (tag, msg, params) => console.log(msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

// Initialise logging
log.init({ application: 'DEBUG', notification: 'DEBUG' }, (level, tag, msg, params) => {
   logger[level as keyof typeof logger](tag, msg, params);
});


export function logCoreError (description: string, details: any) : void {

   logger.ERROR (EConfigStrings.kCoreLogCategory, description, [details]);
}

export function logDbError (description: string, details: any) : void {

   logger.ERROR (EConfigStrings.kDbLogCategory, description, [details]);
}

export function logApiError (description: string, details: any) : void {

   logger.ERROR (EConfigStrings.kApiLogCategory, description, [details]);
}

export function logApiInfo (description: string, details: any) : void {

   logger.INFO (EConfigStrings.kApiLogCategory, description, [details]);
}