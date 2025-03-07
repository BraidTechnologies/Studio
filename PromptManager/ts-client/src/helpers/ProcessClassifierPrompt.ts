import { IStoredPrompt, IPromptPersona } from "../../entry";
/**
 * Post-processes a classifier prompt by replacing classification and input placeholders
 * @param prompt The stored prompt template to process
 * @param classifications The classification categories to use
 * @param userInput The user input to classify
 * @returns A processed prompt persona with placeholders replaced
 * @throws Error if the prompt is not found
 */
export default function ProcessClassifierPrompt(prompt: IStoredPrompt | undefined, classifications: string, userInput: string): IPromptPersona {

    if (typeof prompt !== "undefined") {   
       let systemPrompt = prompt.systemPrompt.replace("{classifications}", classifications);
       let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
       return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
    }
    throw new Error("Prompt not found");
 }