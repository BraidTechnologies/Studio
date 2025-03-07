// Copyright (c) 2024, 2025 Braid Technologies Ltd

import * as fs from "fs";
import * as path from "path";

// Assuming the dist directory is one level above the current directory
const DIR = path.resolve(__dirname); // Current directory
const PARENT_DIR = path.resolve(DIR, "../"); // Parent directory, assuming `dist` is here
const PROMPT_DIR = path.join(PARENT_DIR, "dist", "prompts"); // Path to prompts in parent dist directory
const INTERFACE_DIR = path.join(PARENT_DIR, "dist", "interfaces"); // Path to interfaces in parent dist directory

function loadJson(filePath: string) {
    console.log("filePath", filePath);
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Dynamically import all prompts and export them as named exports
const prompts: IStoredPrompt[]= [];
fs.readdirSync(PROMPT_DIR).forEach((file) => {
    prompts.push(loadJson(path.join(PROMPT_DIR, file)));
});

const interfaces: Record<string, any> = {};
fs.readdirSync(INTERFACE_DIR).forEach((file) => {
    const varName = path.basename(file, ".json");
    interfaces[varName] = loadJson(path.join(INTERFACE_DIR, file));
});
console.log("prompts", prompts);
// Export all prompts and interfaces as named exports
export const { ...promptsExport } = prompts;
const { ...interfacesExport } = interfaces;

//export the interface IPromptPersona
const IPromptPersona = interfacesExport["IPromptPersona"].IPromptPersona;
export type IPromptPersona = typeof IPromptPersona;

//export the interface IStoredPrompt
const IStoredPrompt = interfacesExport["IStoredPrompt"].IStoredPrompt;
export type IStoredPrompt = typeof IStoredPrompt;

//export the enum EPromptPersona
export const EPromptPersona = interfacesExport["EPromptPersona"].EPromptPersona;

export const GeneratedWaterfallPromptNames = interfacesExport["GeneratedWaterfallPromptNames"].GeneratedWaterfallPromptNames;
export const GeneratedSalonPromptNames = interfacesExport["GeneratedSalonPromptNames"].GeneratedSalonPromptNames;
export const GeneratedBoxerPromptNames = interfacesExport["GeneratedBoxerPromptNames"].GeneratedBoxerPromptNames;
export const GeneratedDefaultPromptNames = interfacesExport["GeneratedDefaultPromptNames"].GeneratedDefaultPromptNames;     










