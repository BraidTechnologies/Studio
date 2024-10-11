// Copyright (c) 2024 Braid Technologies Ltd

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