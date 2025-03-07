/**
 * @module IPromptRepository
 * 
 * This module provides interfaces and implementations for managing AI prompt storage
 * and retrieval. It includes functionality for:
 * - Storing prompts with metadata (id, version, persona details)
 * - Retrieving stored prompts by unique identifier
 * - Replacing placeholder values in prompt templates
 * 
 * The module exports:
 * - IPromptRepository interface for prompt storage/retrieval
 * - PromptFileRepository implementation using file-based storage
 * - Helper function for prompt template placeholder replacement
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd


import fs from 'fs';
import { IStoredPrompt } from "../entry";

/**
 * Replaces placeholders in a prompt template with actual values
 * @param template The prompt template containing placeholders e.g. {Hello {name}}
 * @param params An object containing key-value pairs for placeholder replacements e.g. { name: "Jon" } 
 * @returns The prompt with placeholders replaced by actual values e.g. "Hello Jon"
 */
export function replacePromptPlaceholders(template: string, params: { [key: string]: string }): string {
   return template.replace(/\{(.*?)}/g, (_, key) => params[key].toString());
}

/**
 * Interface for a repository that manages prompt storage and retrieval
 */
export interface IPromptRepository {
    /**
     * Retrieves a stored prompt by its unique identifier
     * @param id The unique identifier of the prompt
     * @returns The stored prompt if found
     */
    getPrompt(id: string): IStoredPrompt | undefined;
}

export class PromptFileRepository implements IPromptRepository {
    private prompts: IStoredPrompt[] = [];

    constructor(private readonly promptFilePath: string) {
        this.prompts = JSON.parse(fs.readFileSync(promptFilePath, 'utf8'));
    }

    getPrompt(id: string): IStoredPrompt | undefined {
        return this.prompts.find(p => p.id === id);
    }
}

export class PromptInMemoryRepository implements IPromptRepository {
   private prompts: IStoredPrompt[] = [];

   constructor(prompts: IStoredPrompt[]) {
       this.prompts = prompts;
   }

   getPrompt(id: string): IStoredPrompt | undefined {
       return this.prompts.find(p => p.id === id);
   }
}