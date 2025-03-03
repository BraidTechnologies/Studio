// Copyright (c) 2024, 2025 Braid Technologies Ltd

import * as fs from "fs";
import * as path from "path";

// Assuming the dist directory is one level above the current directory
const DIR = path.resolve(__dirname); // Current directory
const PARENT_DIR = path.resolve(DIR); // Parent directory, assuming `dist` is here
const PROMPT_DIR = path.join(PARENT_DIR, "dist", "prompts"); // Path to prompts in parent dist directory
const INTERFACE_DIR = path.join(PARENT_DIR, "dist", "interfaces"); // Path to interfaces in parent dist directory


function loadJson(filePath: string) {
    let fileContent = fs.readFileSync(filePath, "utf-8")
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error parsing JSON file:", error);
        throw error;
    }
}

// Function to get only JSON files from a directory
function getJsonFiles(directory: string): string[] {
    return fs.readdirSync(directory).filter(file => file.endsWith(".json"));
}

// Dynamically import all prompts and export them as named exports
const prompts: Record<string, any>= [];
getJsonFiles(PROMPT_DIR).forEach((file) => {
    const varName = path.basename(file, ".json");
    prompts[varName] = loadJson(path.join(PROMPT_DIR, file));
});

const interfaces: Record<string, any> = {};
getJsonFiles(INTERFACE_DIR).forEach((file) => {
    const varName = path.basename(file, ".json");
    interfaces[varName] = loadJson(path.join(INTERFACE_DIR, file));
});
// Export all prompts and interfaces as named exports
export const { ...promptsExport } = prompts;
const { ...interfacesExport } = interfaces;
export const allPromptsArray: IStoredPrompt[] = Object.values(promptsExport);

//export the interface IPromptPersona
const IPromptPersona = interfacesExport["IPromptPersona"].IPromptPersona;
export type IPromptPersona = typeof IPromptPersona;

//export the interface IStoredPrompt
const IStoredPrompt = interfacesExport["IStoredPrompt"].IStoredPrompt;
export type IStoredPrompt = typeof IStoredPrompt;

//export the enum EPromptPersona
export const EPromptPersona = interfacesExport["EPromptPersona"].EPromptPersona;

export const GeneratedWaterfallPromptNames = promptsExport["GeneratedWaterfallPromptNames"].GeneratedWaterfallPromptNames;
export const GeneratedSalonPromptNames = promptsExport["GeneratedSalonPromptNames"].GeneratedSalonPromptNames;
export const GeneratedBoxerPromptNames = promptsExport["GeneratedBoxerPromptNames"].GeneratedBoxerPromptNames;
export const GeneratedDefaultPromptNames = promptsExport["GeneratedDefaultPromptNames"].GeneratedDefaultPromptNames;     










