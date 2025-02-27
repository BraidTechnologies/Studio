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

import fs from 'fs';
import path from 'path';

import defaultPrompts from "../src/Default.Prompts.json";
import boxerPrompts from "../src/Boxer.Prompts.json";
import waterfallPrompts from "../src/Waterfall.Prompts.json";

/**
 * Generates TypeScript prompt ID declarations
 */
function generateTypeScriptIds(prompts: any[], outputPath: string) {
    let declarations: string[] = [];

    declarations.push('/**');
    declarations.push(' * Module containing generated prompt IDs for accessing prompts from the prompt repository.');
    declarations.push(' * This file is auto-generated - do not edit directly.');
    declarations.push(' */\n\n');
            
    for (const prompt of prompts) {
        // Convert name to camelCase
        const camelCaseName = prompt.name
            .split(/[^a-zA-Z0-9]+/)
            .map((word: string, index: number) => 
                index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
        
        // Create TypeScript declaration
        declarations.push(`export const ${camelCaseName}PromptId: string = "${prompt.id}";`);
    }

    // Join declarations with newlines
    const output = declarations.join('\n');
    
    // Write declarations to file
    fs.writeFileSync(outputPath, output);
    console.log(`Generated prompt ids for TypeScript in ${outputPath}`);
}

/**
 * Generates Python prompt ID declarations
 */
function generatePythonIds(prompts: any[], outputPath: string) {
    let declarations: string[] = [];

    declarations.push('"""');
    declarations.push('Module containing generated prompt IDs for accessing prompts from the prompt repository.');
    declarations.push('This file is auto-generated - do not edit directly.');
    declarations.push('"""\n\n');

    for (const prompt of prompts) {
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
    fs.writeFileSync(outputPath, output);
    console.log(`Generated prompt ids for Python in ${outputPath}`);
}

// Main execution
generateTypeScriptIds(defaultPrompts, path.join(__dirname, '../src/GeneratedDefaultPromptNames.ts'));
generatePythonIds(defaultPrompts, path.join(__dirname, '../../CommonPy/src/generated_default_prompt_names.py'));

generateTypeScriptIds(boxerPrompts, path.join(__dirname, '../src/GeneratedBoxerPromptNames.ts'));
generatePythonIds(boxerPrompts, path.join(__dirname, '../../CommonPy/src/generated_boxer_prompt_names.py'));

generateTypeScriptIds(waterfallPrompts, path.join(__dirname, '../src/GeneratedWaterfallPromptNames.ts'));
generatePythonIds(waterfallPrompts, path.join(__dirname, '../../CommonPy/src/generated_waterfall_prompt_names.py'));

