// Import JSON objects directly
import defaultPrompts from "./cache/prompts/Default.Prompts.json";
import boxerPrompts from "./cache/prompts/Boxer.Prompts.json";
import waterfallPrompts from "./cache/prompts/Waterfall.Prompts.json";
import salonPrompts from "./cache/prompts/Salon.Prompts.json";

import GeneratedWaterfallPromptNames from "./cache/prompts/GeneratedWaterfallPromptNames.json";
import GeneratedSalonPromptNames from "./cache/prompts/GeneratedSalonPromptNames.json";
import GeneratedBoxerPromptNames from "./cache/prompts/GeneratedBoxerPromptNames.json";
import GeneratedDefaultPromptNames from "./cache/prompts/GeneratedDefaultPromptNames.json";

import IStoredPromptValue from "./cache/interfaces/IStoredPrompt.json";
import IPromptPersonaValue from "./cache/interfaces/IPromptPersona.json";
import EPromptPersonaValue from "./cache/interfaces/EPromptPersona.json";

export type IStoredPrompt = typeof IStoredPromptValue;
export type IPromptPersona = typeof IPromptPersonaValue.IPromptPersona;
// export const EPromptPersona = EPromptPersonaValue.EPromptPersona;
export const EPromptPersona = EPromptPersonaValue.EPromptPersona as { [key: string]: string };

export const allPromptsArray: IStoredPrompt[] = [
    ...defaultPrompts,
    ...boxerPrompts,
    ...waterfallPrompts,
    ...salonPrompts,
];

// Export each JSON object directly (no wrapping in an extra object)
export { 
    defaultPrompts, 
    boxerPrompts, 
    waterfallPrompts, 
    salonPrompts,
    GeneratedWaterfallPromptNames, 
    GeneratedSalonPromptNames, 
    GeneratedBoxerPromptNames, 
    GeneratedDefaultPromptNames,
};
