# Copyright (c) 2024 Braid Technologies Ltd

# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json
import random
from typing import List, Dict, Any

# Third-Party Packages
import openai
from openai.embeddings_utils import get_embedding
from tenacity import (
    retry,
    wait_random_exponential,
    stop_after_attempt,
    retry_if_not_exception_type,
)
from rich.progress import Progress
import numpy as np
from numpy.linalg import norm

# Local Modules
from common.ApiConfiguration import ApiConfiguration

# Constants for various prompts used in the application
kOpenAiPersonaPrompt = (
    "You are an AI assistant helping an application developer understand generative AI. "
    "You explain complex concepts in simple language, using Python examples if it helps. "
    "You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. "
    "If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'."
)
kInitialQuestionPrompt = (
    "You are an AI assistant helping an application developer understand generative AI. "
    "You will be presented with a question. Answer the question in a few sentences, using language suitable for a technical graduate student will understand. "
    "Limit your reply to 50 words or less. If you don't know the answer, say 'I don't know'. "
    "If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n"
)
kEnrichmentPrompt = (
    "You will be provided with a question about building applications that use generative AI technology. "
    "Write a 50 word summary of an article that would be a great answer to the question. "
    "Consider enriching the question with additional topics that the question asker might want to understand. "
    "Write the summary in the present tense, as though the article exists. "
    "If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n"
)
kFollowUpPrompt = (
    "You will be provided with a summary of an article about building applications that use generative AI technology. "
    "Write a question of no more than 10 words that a reader might ask as a follow up to reading the article."
)
kEnrichmentQuestionPrefix = "Question:"
kFollowUpPrefix = "Article summary: "
kPersonaGenerationPrompt = (
    "Generate a diverse persona for testing an AI learning assistant. Include attributes such as technical background, learning style, and specific areas of interest in AI. "
    "Provide the persona in JSON format."
)
kGapAnalysisPrompt = (
    "Analyze the following test results and identify any gaps in the AI learning assistant's knowledge or performance. "
    "Provide a summary of the gaps and suggestions for improvement in JSON format."
)

class TestResult:
    """
    Class to represent the result of a test question.
    """
    def __init__(self) -> None:
        self.question: str = ""
        self.enriched_question: str = ""
        self.hit: bool = False
        self.hitRelevance: float = 0
        self.hitSummary: str = ""
        self.followUp: str = ""
        self.followUpOnTopic: str = ""

class Persona:
    """
    Class to represent a user persona.
    """
    def __init__(self, data: Dict[str, Any]):
        self.technical_background: str = data.get('technical_background', '')
        self.learning_style: str = data.get('learning_style', '')
        self.interests: List[str] = data.get('interests', [])

    def generate_question(self) -> str:
        """
        Generate a question based on the persona's interests.
        """
        interests = random.choice(self.interests)
        return f"How can I implement {interests} in my AI application?"

@retry(
    wait=wait_random_exponential(min=5, max=15),
    stop=stop_after_attempt(15),
    retry=retry_if_not_exception_type(openai.BadRequestError),
)
def call_openai_api(config: ApiConfiguration, messages: List[Dict[str, str]], logger) -> str:
    """
    Call the OpenAI API and handle retries on failure.

    Args:
        config: ApiConfiguration object containing API configuration details.
        messages: List of messages to send to the OpenAI API.
        logger: Logger object for logging information.

    Returns:
        The response text from the API.
    """
    response = openai.ChatCompletion.create(
        deployment_id=config.azureDeploymentName,
        model=config.modelName,
        messages=messages,
        temperature=0.7,
        max_tokens=config.maxTokens,
        top_p=0.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        request_timeout=config.openAiRequestTimeout,
    )

    text = response.get("choices", [])[0].get("message", {}).get("content", "")
    finish_reason = response.get("choices", [])[0].get("finish_reason", "")

    if finish_reason not in ["stop", "length", ""]:
        logger.warning("Stop reason: %s", finish_reason)
        logger.warning("Text: %s", text)
        logger.warning("Increase Max Tokens and try again")
        exit(1)

    return text

def get_enriched_question(config: ApiConfiguration, text: str, logger) -> str:
    """
    Get an enriched version of the given question.

    Args:
        config: ApiConfiguration object containing API configuration details.
        text: The original question text.
        logger: Logger object for logging information.

    Returns:
        The enriched question text.
    """
    messages = [
        {"role": "system", "content": kOpenAiPersonaPrompt},
        {"role": "user", "content": kEnrichmentPrompt + kEnrichmentQuestionPrefix + text}
    ]
    return call_openai_api(config, messages, logger)

def get_text_embedding(config: ApiConfiguration, text: str, logger) -> List[float]:
    """
    Get the embedding for a given text.

    Args:
        config: ApiConfiguration object containing API configuration details.
        text: The text to embed.
        logger: Logger object for logging information.

    Returns:
        The embedding vector for the text.
    """
    embedding = get_embedding(
        text,
        engine=config.azureEmbedDeploymentName,
        deployment_id=config.azureEmbedDeploymentName,
        model=config.azureEmbedDeploymentName,
        timeout=config.openAiRequestTimeout
    )
    return embedding

def get_followup_question(config: ApiConfiguration, text: str, logger) -> str:
    """
    Generate a follow-up question based on the provided text.

    Args:
        config: ApiConfiguration object containing API configuration details.
        text: The text summary for which a follow-up question is to be generated.
        logger: Logger object for logging information.

    Returns:
        The follow-up question text.
    """
    messages = [
        {"role": "system", "content": kFollowUpPrompt},
        {"role": "user", "content": text}
    ]
    return call_openai_api(config, messages, logger)

def assess_followup_question(config: ApiConfiguration, text: str, logger) -> str:
    """
    Assess if a follow-up question is on the topic of AI.

    Args:
        config: ApiConfiguration object containing API configuration details.
        text: The follow-up question text.
        logger: Logger object for logging information.

    Returns:
        'yes' if the question is about AI, 'no' otherwise.
    """
    messages = [
        {"role": "system", "content": "You are an AI assistant helping a team of developers understand AI. You explain complex concepts in simple language. You will be asked a question. Respond 'yes' if the question appears to be about AI, otherwise respond 'no'."},
        {"role": "user", "content": text}
    ]
    return call_openai_api(config, messages, logger)

def cosine_similarity(a: List[float], b: List[float]) -> float:
    """
    Calculate the cosine similarity between two vectors.

    Args:
        a: First vector.
        b: Second vector.

    Returns:
        Cosine similarity between the two vectors.
    """
    return np.dot(a, b) / (norm(a) * norm(b))

def generate_persona(config: ApiConfiguration, logger) -> Persona:
    """
    Generate a new persona by calling the OpenAI API.

    Args:
        config: ApiConfiguration object containing API configuration details.
        logger: Logger object for logging information.

    Returns:
        A Persona object with attributes populated from the API response.
    """
    messages = [
        {"role": "system", "content": kPersonaGenerationPrompt}
    ]
    persona_data = json.loads(call_openai_api(config, messages, logger))
    return Persona(persona_data)

def perform_gap_analysis(config: ApiConfiguration, test_results: List[TestResult], logger) -> Dict[str, Any]:
    """
    Perform a gap analysis on the test results to identify knowledge gaps.

    Args:
        config: ApiConfiguration object containing API configuration details.
        test_results: List of TestResult objects representing test results.
        logger: Logger object for logging information.

    Returns:
        A dictionary summarizing the gaps and suggestions for improvement.
    """
    results_summary = json.dumps([result.__dict__ for result in test_results])
    messages = [
        {"role": "system", "content": kGapAnalysisPrompt},
        {"role": "user", "content": results_summary}
    ]
    gap_analysis = json.loads(call_openai_api(config, messages, logger))
    return gap_analysis

def update_knowledge_base(gap_analysis: Dict[str, Any], knowledge_base: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Update the knowledge base with new suggestions from the gap analysis.

    Args:
        gap_analysis: A dictionary containing the results of the gap analysis.
        knowledge_base: The existing knowledge base to be updated.

    Returns:
        The updated knowledge base.
    """
    for suggestion in gap_analysis.get('suggestions', []):
        # This is a simplified example. In a real scenario, you'd need more sophisticated logic
        # to determine how to incorporate suggestions into the knowledge base.
        knowledge_base.append({
            "content": suggestion,
            "embedding": None  # You'd need to generate an embedding for this new content
        })
    return knowledge_base

def run_feedback_loop(config: ApiConfiguration, testDestinationDir: str, sourceDir: str, initial_questions: List[str]):
    """
    Run the feedback loop to test and improve the AI learning assistant.

    Args:
        config: ApiConfiguration object containing API configuration details.
        testDestinationDir: Directory to save test results.
        sourceDir: Directory containing the source data.
        initial_questions: List of initial questions to start the feedback loop.

    Returns:
        None
    """
    logging.basicConfig(level=logging.WARNING)
    logger = logging.getLogger(__name__)

    openai.api_type = config.apiType
    openai.api_key = config.apiKey
    openai.api_base = config.resourceEndpoint
    openai.api_version = config.apiVersion

    if not testDestinationDir:
        logger.error("Test data folder not provided")
        exit(1)

    # Load the existing knowledge base
    cache_file = os.path.join(sourceDir, "embeddings_lite.json")
    with open(cache_file, "r", encoding="utf-8") as f:
        knowledge_base = json.load(f)

    iteration = 0
    max_iterations = 5  # Set a limit to avoid infinite loops

    while iteration < max_iterations:
        logger.info(f"Starting iteration {iteration + 1}")

        # Generate diverse personas
        personas = [generate_persona(config, logger) for _ in range(5)]

        # Generate questions from personas and combine with initial questions
        questions = initial_questions + [persona.generate_question() for persona in personas]

        # Run tests
        test_results = []
        for question in questions:
            result = TestResult()
            result.question = question
            result.enriched_question = get_enriched_question(config, question, logger)
            embedding = get_text_embedding(config, result.enriched_question, logger)

            # Find the best match in the knowledge base
            for chunk in knowledge_base:
                ada = chunk.get("ada_v2")
                similarity = cosine_similarity(ada, embedding)
                if similarity > 0.8:
                    result.hit = True
                if similarity > result.hitRelevance:
                    result.hitRelevance = similarity
                    result.hitSummary = chunk.get("summary")

            result.followUp = get_followup_question(config, result.hitSummary, logger)
            result.followUpOnTopic = assess_followup_question(config, result.followUp, logger)
            test_results.append(result)

        # Perform gap analysis
        gap_analysis = perform_gap_analysis(config, test_results, logger)

        # Update knowledge base
        knowledge_base = update_knowledge_base(gap_analysis, knowledge_base)

        # Save updated knowledge base
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(knowledge_base, f)

        # Save test results
        output_file = os.path.join(testDestinationDir, f"test_output_iteration_{iteration}.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump([result.__dict__ for result in test_results], f)

        iteration += 1

    logger.info("Feedback loop completed")

if __name__ == "__main__":
    # Initialize your config and other necessary variables here
    config = ApiConfiguration()  # You'll need to properly initialize this
    testDestinationDir = "path/to/test/destination"
    sourceDir = "path/to/source"
    initial_questions = [
        "What is a transformer in machine learning?",
        "How can I implement BERT for text classification?",
        "What are the best practices for fine-tuning GPT models?"
    ]

    run_feedback_loop(config, testDestinationDir, sourceDir, initial_questions)








'''

Initialization: Configures logging, sets up the API, and loads the existing knowledge base.

Iteration Loop: Runs a set number of iterations (5 in this case):
    Generate Personas: Creates diverse personas to simulate different types of users.
    Generate Questions: Combines initial questions with questions generated from personas.
    Run Tests: For each question, it enriches the question, gets text embeddings, finds the best match in the knowledge base, generates follow-up questions, and assesses their relevance.
    Gap Analysis: Analyzes test results to find knowledge gaps.
    Update Knowledge Base: Incorporates suggestions into the knowledge base.
    Save Results: Stores the updated knowledge base and test results.

Completion: Logs the completion of the feedback loop.



'''