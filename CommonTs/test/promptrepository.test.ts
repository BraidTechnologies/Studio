/**
 * @module promptrepository.test
 * 
 * Unit tests for the PromptRepository module which handles storage and retrieval
 * of AI conversation prompts. Tests verify:
 * - Loading prompts from JSON file storage
 * - Retrieving individual prompts by ID
 * - Proper handling of prompt metadata (version, persona, templates)
 * 
 * Uses temporary test files to validate repository functionality in isolation.
 */

// Copyright Braid Technologies Ltd, 2025

import { expect } from 'expect';
import { describe, it, before } from 'mocha';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { IStoredPrompt, PromptFileRepository, replacePromptPlaceholders } from '../src/IPromptRepository';
import { throwIfUndefined } from '../src/Asserts';

describe('PromptRepository', function() {
    let tempDir: string;
    let samplePromptsFile: string;

    before(async function() {
        // Create temporary directory and file
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-prompts-'));
        samplePromptsFile = path.join(tempDir, 'test_prompts.json');

        // Create test data
        const prompts = [{
            "id": "test-prompt-1",
            "version": "1.0", 
            "personaName": "TestBot",
            "systemPrompt": "You are a test bot",
            "userPrompt": "Hello {name}"
        }];

        // Write test data to file
        fs.writeFileSync(samplePromptsFile, JSON.stringify(prompts));
    });

    it('should load a single prompt', async function() {
        // Initialize repository with test file
        const repo = new PromptFileRepository(samplePromptsFile);

        // Test loading a specific prompt
        const prompt = await repo.getPrompt("test-prompt-1");

        // Verify the prompt data
        expect(prompt).toBeDefined();
        expect(prompt?.id).toEqual("test-prompt-1");
        expect(prompt?.version).toEqual("1.0");
        expect(prompt?.personaName).toEqual("TestBot");
        expect(prompt?.systemPrompt).toEqual("You are a test bot");
        expect(prompt?.userPrompt).toEqual("Hello {name}");
    });

    it('should lcorrectly replace parameters in a prompt', async function() {
      // Initialize repository with test file
      const repo = new PromptFileRepository(samplePromptsFile);

      // Test loading a specific prompt
      const prompt : IStoredPrompt | undefined = await repo.getPrompt("test-prompt-1");

      // Verify the prompt data
      expect(prompt).toBeDefined();
      expect(prompt?.id).toEqual("test-prompt-1");
      expect(prompt?.version).toEqual("1.0");
      expect(prompt?.personaName).toEqual("TestBot");
      expect(prompt?.systemPrompt).toEqual("You are a test bot");
      expect(prompt?.userPrompt).toEqual("Hello {name}");

      throwIfUndefined(prompt);
      let result = replacePromptPlaceholders(prompt?.userPrompt, {name: "Jon"});
      expect(result).toEqual("Hello Jon");
  });
});