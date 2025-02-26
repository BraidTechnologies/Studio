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

import Prompts from "../src/Prompts.json";
import fs from 'fs';
import path from 'path';

/**
 * Generates TypeScript prompt ID declarations
 */
function generateTypeScriptIds() {
    let declarations: string[] = [];

    declarations.push('/**');
    declarations.push(' * Module containing generated prompt IDs for accessing prompts from the prompt repository.');
    declarations.push(' * This file is auto-generated - do not edit directly.');
    declarations.push(' */\n\n');
            
    for (const prompt of Prompts) {
        // Convert name to camelCase
        const camelCaseName = prompt.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        
        // Create TypeScript declaration
        declarations.push(`export const ${camelCaseName}PromptId: string = "${prompt.id}";`);
    }

    // Join declarations with newlines
    const output = declarations.join('\n');
    
    // Write declarations to file
    const outputPath = path.join(__dirname, '../src/GeneratedPromptNames.ts');
    fs.writeFileSync(outputPath, output);
    console.log(`Generated prompt ids for TypeScript in ${outputPath}`);
}

/**
 * Generates Python prompt ID declarations
 */
function generatePythonIds() {
    let declarations: string[] = [];

    declarations.push('"""');
    declarations.push('Module containing generated prompt IDs for accessing prompts from the prompt repository.');
    declarations.push('This file is auto-generated - do not edit directly.');
    declarations.push('"""\n\n');

    for (const prompt of Prompts) {
        // Convert name to snake_case
        const snakeCaseName = prompt.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, '_');
        
        // Create Python variable declaration 
        declarations.push(`${snakeCaseName}_prompt_id = "${prompt.id}"`);
    }

    // Join declarations with newlines
    const output = declarations.join('\n');

    // Write declarations to file
    const outputPath = path.join(__dirname, '../../CommonPy/src/generated_prompt_names.py');
    fs.writeFileSync(outputPath, output);
    console.log(`Generated prompt ids for Python in ${outputPath}`);
}

// Main execution
generateTypeScriptIds();
generatePythonIds();