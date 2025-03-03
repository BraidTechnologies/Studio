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
import { PromptFileRepository, PromptInMemoryRepository, replacePromptPlaceholders } from '../IPromptRepository';
import { throwIfUndefined } from 'commonts/src/Asserts';
import { getChatPersona } from '../PromptPersonaFactory';
import { EPromptPersona, IStoredPrompt} from '../../entry';

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

    it('should correctly replace parameters in a prompt', async function() {
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

    it('should correctly load target prompts with replacement parameters', async function() {
        const fileName = "trial_prompts.json";
        const filePath = path.join(__dirname, fileName);
        // Initialize repository with test file
        const repo = new PromptFileRepository(filePath);

        const promptId1 = "3983ba1b-895d-46fe-a47e-e4230b06c0d6";
        const promptId2 = "4761bf88-9329-4bd0-95ca-dc3bc70b6d4d";
        const promptId3 = "716c667d-9074-4d9a-8335-3194212eba90";

        // Test loading a specific prompt
        const prompt : IStoredPrompt | undefined = await repo.getPrompt(promptId1);
        expect(prompt).toBeDefined();
        throwIfUndefined(prompt);
        let result = replacePromptPlaceholders(prompt.systemPrompt, {wordCount: "50"});
        expect(result).toContain("50");

        // Test loading a specific prompt
        const prompt2 : IStoredPrompt | undefined = await repo.getPrompt(promptId2);
        expect(prompt2).toBeDefined();
        throwIfUndefined(prompt2);
        let result2 = replacePromptPlaceholders(prompt2.systemPrompt, {wordCount: "50"});
        expect(result2).toContain("50");

        // Test loading a specific prompt
        const prompt3 : IStoredPrompt | undefined = await repo.getPrompt(promptId3);
        expect(prompt3).toBeDefined();
        throwIfUndefined(prompt3);
        let result3 = replacePromptPlaceholders(prompt3.systemPrompt, {wordCount: "50"});
        expect(result3).toContain("50");
    });

    it('should correctly load default prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kDefault, "Hello", {wordTarget: 50});   
      expect(persona.systemPrompt).toContain("50");
      expect(persona.userPrompt).toContain("Hello");
    }); 

    it('should correctly load developer assistant prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kDeveloperAssistant, "Hello", {wordTarget: 50});   
      expect(persona.systemPrompt).toContain("50");
      expect(persona.userPrompt).toContain("Hello");
    });     

    it('should correctly load developer question generator prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kDeveloperQuestionGenerator, "Hello", {wordTarget: 10});   
      expect(persona.systemPrompt).toContain("10");
      expect(persona.userPrompt).toContain("Hello");
    });      

    it('should correctly load load developer imagined answer generator prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kDeveloperImaginedAnswerGenerator, "How do LLMs work?");   
      expect(persona.userPrompt).toContain("How do LLMs work?");
    });    

    it('should correctly load article summariser prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kArticleSummariser, "Hello", {wordTarget: 50});   
      expect(persona.systemPrompt).toContain("50");
      expect(persona.userPrompt).toContain("Hello");
    });  

    it('should correctly load article classifier prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kArticleClassifier, "Hello", {classifications: "AI, LLMs, Generative AI"});   
      expect(persona.systemPrompt).toContain("AI, LLMs, Generative AI");
      expect(persona.userPrompt).toContain("Hello");
    });      

    it('should correctly load theme finder prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kThemeFinder, "Breatstroke, Front Crawl, Freestyle", {wordTarget: 1});   
      expect(persona.systemPrompt).toContain("1");
      expect(persona.userPrompt).toContain("Breatstroke, Front Crawl, Freestyle");
    });      

    it('should correctly load test for summarise failure prompt', async function() {
         const persona = getChatPersona(EPromptPersona.kTestForSummariseFail, "I apologise for this");   
         expect(persona.userPrompt).toContain("I apologise for this");
    });     

    it('should correctly load survey summariser prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kSurveySummariser, "Everything is great", {wordTarget: 50});   
      expect(persona.systemPrompt).toContain("50");
      expect(persona.userPrompt).toContain("Everything is great");
    });     

    it('should correctly load code summariser prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kCodeSummariser, "{// A great module}", {wordTarget: 50});   
      expect(persona.systemPrompt).toContain("50");
      expect(persona.userPrompt).toContain("{// A great module}");
    });     

    it('should correctly load c4 diagrammer prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kC4Diagrammer, "A single module that is great", {c4DiagramType: "Context", wordTarget: 50});   
      expect(persona.userPrompt).toContain("Context");
      expect(persona.userPrompt).toContain("A single module that is great");      
    });        
    
    it('should correctly load article context summariser prompt', async function() {
      const persona = getChatPersona(EPromptPersona.kArticleContextSummariser, "A single module that is great", {chunk: "a chunk", document: "A document that contains a chunk", wordTarget: 50});   
      expect(persona.userPrompt).toContain("a chunk");
      expect(persona.userPrompt).toContain("A document that contains a chunk");
      expect(persona.systemPrompt).toContain("50");
    });     
    
});