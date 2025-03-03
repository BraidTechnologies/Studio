import { IStoredPrompt, IPromptPersona} from "../../entry";

/**
 * Post-processes a C4 diagrammer prompt by replacing the user input and C4 diagram type placeholders
 * @param prompt The stored prompt template to process
 * @param c4DiagramType The type of C4 diagram to generate
 * @param userInput The user input to insert into the prompt
 * @returns A processed prompt persona with placeholders replaced
 */
export default function ProcessC4DigarammerPrompt(prompt: IStoredPrompt | undefined, c4DiagramType: string, userInput: string): IPromptPersona {

    if (typeof prompt !== "undefined") {   
       let userPrompt = prompt.userPrompt.replace("{userInput}", userInput).replace("{C4DiagramType}", c4DiagramType);
       return {userPrompt: userPrompt, systemPrompt: prompt.systemPrompt, name: prompt.personaName};
    }
    throw new Error("Prompt not found");
 }