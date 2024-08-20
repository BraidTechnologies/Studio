# Standard Library Imports
import logging
import os
import json
import sys
from logging import Logger
from typing import List
import numpy as np
from numpy.linalg import norm

# Third-Party Packages
from openai import AzureOpenAI, OpenAIError, BadRequestError, APIConnectionError
from tenacity import retry, wait_random_exponential, stop_after_attempt, retry_if_not_exception_type

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Local Modules
from common.ApiConfiguration import ApiConfiguration

# Constants
OPENAI_PERSONA_PROMPT = (
    "You are an AI assistant helping an application developer understand generative AI. "
    "You explain complex concepts in simple language, using Python examples if it helps. "
    "You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. "
    "If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'."
)
ENRICHMENT_PROMPT = (
    "You will be provided with a question about building applications that use generative AI technology. "
    "Write a 50-word summary of an article that would be a great answer to the question. "
    "Consider enriching the question with additional topics that the question asker might want to understand. "
    "Write the summary in the present tense, as though the article exists. "
    "If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'."
)
FOLLOW_UP_PROMPT = (
    "You will be provided with a summary of an article about building applications that use generative AI technology. "
    "Write a question of no more than 10 words that a reader might ask as a follow-up to reading the article."
)

# Setup Logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure the Azure OpenAI API client
def configure_openai_for_azure(config: ApiConfiguration) -> AzureOpenAI:
    return AzureOpenAI(
        azure_endpoint=config.resourceEndpoint, 
        api_key=config.apiKey.strip(),  # Ensure the API key is stripped of any whitespace
        api_version=config.apiVersion
    )

class TestResult:
    def __init__(self) -> None:
        self.question = ""
        self.enriched_question = ""        
        self.hit = False 
        self.hit_relevance = 0.0
        self.hit_summary = ""
        self.follow_up = ""
        self.follow_up_on_topic = ""

@retry(
    wait=wait_random_exponential(min=5, max=15), 
    stop=stop_after_attempt(15), 
    retry=retry_if_not_exception_type(BadRequestError)
)
def call_openai_chat(client: AzureOpenAI, messages: list, config: ApiConfiguration, logger: logging.Logger) -> str:
    """Generic function to call OpenAI chat and handle responses."""
    try:
        response = client.chat.completions.create(
            model=config.azureDeploymentName,  # Use the model specified in the configuration
            messages=messages,
            temperature=0.7,
            max_tokens=config.maxTokens,
            top_p=0.0,
            frequency_penalty=0,
            presence_penalty=0,
            timeout=config.openAiRequestTimeout,
        )

        # Access the response message content
        content = response.choices[0].message.content
        finish_reason = response.choices[0].finish_reason

        if finish_reason not in {"stop", "length", ""}:
            logger.warning("Unexpected stop reason: %s", finish_reason)
            logger.warning("Content: %s", content)
            logger.warning("Consider increasing max tokens and retrying.")
            exit(1)

        return content

    except OpenAIError as e:
        logger.error(f"OpenAI API error: {e}")
        raise
    except APIConnectionError as e:
        logger.error(f"API connection error: {e}")
        raise

@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def get_text_embedding(client: AzureOpenAI, config: ApiConfiguration, text: str, logger: Logger) -> np.ndarray:
    """Get the embedding for a text using OpenAI's embedding model."""
    try:
        response = client.embeddings.create(
            input=text,
            model=config.azureEmbedDeploymentName,  # Use the model specified in the configuration
            timeout=config.openAiRequestTimeout
        )
        embedding = response.data[0].embedding
        return np.array(embedding)
    except OpenAIError as e:
        logger.error(f"Error getting text embedding: {e}")
        raise

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """
    Calculate the cosine similarity between two vectors.

    Args:
    a (np.ndarray): The first vector.
    b (np.ndarray): The second vector.

    Returns:
    float: The cosine similarity between the two vectors.
    """
    # Check if the input vectors are numpy arrays
    if not isinstance(a, np.ndarray) or not isinstance(b, np.ndarray):
        raise ValueError("Input vectors must be numpy arrays")

    # Check if the input vectors have the same shape
    if a.shape != b.shape:
        raise ValueError("Input vectors must have the same shape")

    # Calculate the dot product of the two vectors
    dot_product = np.dot(a, b)

    # Calculate the L2 norm (magnitude) of each vector
    a_norm = norm(a)
    b_norm = norm(b)

    # Check for division by zero
    if a_norm == 0 or b_norm == 0:
        raise ValueError("Input vectors must not be zero vectors")

    # Calculate the cosine similarity
    similarity = dot_product / (a_norm * b_norm)

    return similarity

@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def generate_enriched_question(client: AzureOpenAI, config: ApiConfiguration, question: str, logger: logging.Logger) -> str:
    messages = [
        {"role": "system", "content": OPENAI_PERSONA_PROMPT},
        {"role": "user", "content": ENRICHMENT_PROMPT + "Question: " + question},
    ]

    # Log the API request
    logger.info("Making API request to OpenAI...")
    logger.info("Request payload:")
    logger.info(messages)

    response = call_openai_chat(client, messages, config, logger)

    # Log the API response
    logger.info("API response received:")
    logger.info(response)

    return response

def run_tests(config: ApiConfiguration, test_destination_dir: str, source_dir: str, questions: List[str]) -> None:
    """Run tests with the given questions."""
    # Configure the OpenAI client
    client = configure_openai_for_azure(config)

    # Check if test_destination_dir is provided
    if not test_destination_dir:
        logger.error("Test data folder not provided")
        exit(1)

    # Read the stored chunks from the source directory
    current_chunks = []
    for filename in os.listdir(source_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(source_dir, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                chunk = json.load(f)
                current_chunks.append(chunk)

    # Run the tests
    results = []
    for question in questions:
        result = TestResult()
        result.question = question

        result.enriched_question = generate_enriched_question(client, config, question, logger)

        # Convert the text of the enriched question to a vector embedding
        embedding = get_text_embedding(client, config, result.enriched_question, logger)

        # Iterate through the stored chunks
        for chunk in current_chunks:
            ada_embedding = chunk.get("ada_v2")
            similarity = cosine_similarity(ada_embedding, embedding)

            # Count it as a hit if we pass a reasonableness threshold
            if similarity > 0.8:
                result.hit = True

            # Record the best match
            if similarity > result.hit_relevance:
                result.hit_relevance = similarity
                result.hit_summary = chunk.get("summary")

        results.append(result)

    logger.debug("Total tests processed: %s", len(results))

    output_results = [
        {
            "question": result.question,
            "enriched_question": result.enriched_question,
            "hit": result.hit,
            "summary": result.hit_summary,
            "hitRelevance": result.hit_relevance,
        }
        for result in results
    ]

    # Save the test results to a JSON file
    output_file = os.path.join(test_destination_dir, "test_output.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_results, f, indent=4)

# Test script logic
questions = [
    "What is a Large Language Model (LLM)?",
    "How do Large Language Models (LLMs) work?",
    "What are some common use cases for Large Language Models (LLMs) in applications?"
]

config = ApiConfiguration()  
test_destination_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/test output/"
source_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/data/"

if not os.path.exists(test_destination_dir):
    os.makedirs(test_destination_dir)

run_tests(config, test_destination_dir, source_dir, questions)