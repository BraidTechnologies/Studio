// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module IKeyGenerator
 * @description Provides an interface for a class to generate unique keys.
 * 
 * This module includes the IKeyGenerator interface which defines methods for generating keys and secrets,
 * checking if a key could be a valid key, saving and matching secrets, and managing saved secrets.
 */

/// <summary>
/// IKeyGenerator - interface for a class to generate unique keys
/// </summary>
export interface IKeyGenerator {

   generateKey (): string;
   generateSecret(): string;
   couldBeAKey(key: string): boolean;
   saveSecret(secret: string): void;
   matchesSavedSecret (secret: string): boolean;
   haveSavedSecret  () : boolean;
   savedSecret  () : string;
}