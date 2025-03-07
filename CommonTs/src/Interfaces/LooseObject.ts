// Copyright (c) 2024, 2025 Braid Technologies Ltd

/**
 * @module LooseObject
 * @description Defines a type for a loose object that can contain any key-value pairs.
 * 
 * This module provides a type alias for an object that allows for dynamic key-value
 * assignments, useful for creating flexible data structures without specifying
 * a fixed schema.
 */
export interface LooseObject {
   [key: string]: any
}
