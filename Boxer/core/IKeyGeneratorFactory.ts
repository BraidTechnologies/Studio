// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module IKeyGeneratorFactory
 * @description Provides a factory function for creating key generators.
 * 
 * This module includes the getDefaultKeyGenerator function which returns a new instance of the UuidKeyGenerator class.
 */

import { IKeyGenerator } from './IKeyGenerator';
import { UuidKeyGenerator } from './UuidKeyGenerator';

/// <summary>
/// getDefaultKeyGenerator - returns the key generator
/// </summary>

export function getDefaultKeyGenerator(): IKeyGenerator {
   return new UuidKeyGenerator();
}