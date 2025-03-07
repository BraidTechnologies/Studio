import { IStoredPrompt, IPromptPersona } from "../../entry";
/**
 * Post-processes an article context prompt by replacing the word count, chunk, and document placeholders
 * @param prompt The stored prompt template to process
 * @param wordCount The default word count to use in the prompt
 * @param chunk The chunk of text to use in the prompt
 * @param document The document to use in the prompt
 * @returns A processed prompt persona with placeholders replaced
 */ 
export default function ProcessArticleContextPrompt(prompt: IStoredPrompt | undefined, wordCount: number, chunk: string, document: string): IPromptPersona {

    if (typeof prompt !== "undefined") {   
       let systemPrompt = prompt.systemPrompt.replace("{wordCount}", wordCount.toString());
       let userPrompt = prompt.userPrompt.replace("{chunk}", chunk).replace("{document}", document).replace("{wordCount}", wordCount.toString());
       return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
    }  
    throw new Error("Prompt not found");
 }
 