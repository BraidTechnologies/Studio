// Copyright (c) 2024 Braid Technologies Ltd

import { IKeyGenerator } from './IKeyGenerator';
import { UuidKeyGenerator } from './UuidKeyGenerator';

/// <summary>
/// getDefaultKeyGenerator - returns the key generator
/// </summary>

export function getDefaultKeyGenerator(): IKeyGenerator {
   return new UuidKeyGenerator();
}