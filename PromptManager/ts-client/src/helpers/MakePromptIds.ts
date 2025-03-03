import fs from 'fs';
import path from 'path';

import defaultPrompts from "../../../prompts/Default.Prompts.json";
import boxerPrompts from "../../../prompts/Boxer.Prompts.json";
import waterfallPrompts from "../../../prompts/Waterfall.Prompts.json";
import salonPrompts from "../../../prompts/Salon.Prompts.json";

/**
 * Generates a JSON file with prompt ID declarations.
 * The output JSON maps a camelCase version of the prompt name (appended with "PromptId")
 * to the prompt's id.
 *
 * @param prompts - Array of prompt objects (each should have "name" and "id" properties).
 * @param outputPath - The file path where the JSON output will be written.
 */
function generateJsonIds(prompts: any[], outputPath: string) {
    const ids: Record<string, string> = {};

    for (const prompt of prompts) {
        // Convert the prompt name to camelCase
        const camelCaseName = prompt.name
            .split(/[^a-zA-Z0-9]+/)
            .map((word: string, index: number) => 
                index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
        
        // Create a key by appending "PromptId" and set its value to prompt.id
        ids[camelCaseName + "PromptId"] = prompt.id;
    }

    // Write the resulting JSON object to the specified output path with pretty printing
    fs.writeFileSync(outputPath, JSON.stringify(ids, null, 2), "utf-8");
    console.log(`Generated prompt IDs JSON in ${outputPath}`);
}

// Merge all prompts from the different sources
const allPrompts = [...defaultPrompts, ...boxerPrompts, ...waterfallPrompts, ...salonPrompts];

// Determine the output directory and path.
// Here we assume that the parent "prompts" folder is two levels up from this file.
const OUTPUT_DIR = path.resolve(__dirname, "../../../prompts");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "generatedPromptIds.json");

// Generate the JSON file with prompt IDs
generateJsonIds(allPrompts, OUTPUT_PATH);

generateJsonIds(defaultPrompts, path.join(__dirname, '../../../prompts/GeneratedDefaultPromptNames.json'));

generateJsonIds(boxerPrompts, path.join(__dirname, '../../../prompts/GeneratedBoxerPromptNames.json'));

generateJsonIds(waterfallPrompts, path.join(__dirname, '../../../prompts/GeneratedWaterfallPromptNames.json'));

generateJsonIds(salonPrompts, path.join(__dirname, '../../../prompts/GeneratedSalonPromptNames.json'));
