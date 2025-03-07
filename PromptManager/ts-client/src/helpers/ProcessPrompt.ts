
/**
 * Post-processes a stored prompt by replacing placeholders with actual values
 * @param prompt The stored prompt template to process
 * @param wordCount The default word count to use in the prompt
 * @param userInput The user input to insert into the prompt
 * @returns A processed prompt persona with placeholders replaced
 * @throws Error if the prompt is not found
 */

import { IStoredPrompt, IPromptPersona } from "../../entry";

export default function ProcessPrompt(prompt: IStoredPrompt | undefined, wordCount: number, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{wordCount}", wordCount.toString());
      let userPrompt = prompt.userPrompt.replace("{userInput}", userInput).replace("{wordCount}", wordCount.toString());
      return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
   }
   throw new Error("Prompt not found");
}