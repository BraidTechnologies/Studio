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
from common.common_functions import get_embedding

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
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Function to configure the Azure OpenAI API client
def configure_openai_for_azure(config: ApiConfiguration) -> AzureOpenAI:
    return AzureOpenAI(
        azure_endpoint=config.resourceEndpoint, 
        api_key=config.apiKey.strip(),
        api_version=config.apiVersion
    )

# Class to hold test results
class TestResult:
    def __init__(self) -> None:
        self.question = ""
        self.enriched_question = ""        
        self.hit = False 
        self.hit_relevance = 0.0
        self.hit_summary = ""
        self.follow_up = ""
        self.follow_up_on_topic = ""

# Function to call the OpenAI API with retry logic
@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def call_openai_chat(client: AzureOpenAI, messages: list, config: ApiConfiguration, logger: logging.Logger) -> str:
    try:
        response = client.chat.completions.create(
            model=config.azureDeploymentName,
            messages=messages,
            temperature=0.7,
            max_tokens=config.maxTokens,
            top_p=0.0,
            frequency_penalty=0,
            presence_penalty=0,
            timeout=config.openAiRequestTimeout,
        )
        content = response.choices[0].message.content
        finish_reason = response.choices[0].finish_reason

        if finish_reason not in {"stop", "length", ""}:
            logger.warning("Unexpected stop reason: %s", finish_reason)
            logger.warning("Content: %s", content)
            logger.warning("Consider increasing max tokens and retrying.")
            exit(1)

        return content

    except (OpenAIError, APIConnectionError) as e:
        logger.error(f"Error: {e}")
        raise

# Function to retrieve text embeddings using OpenAI API with retry logic
@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def get_text_embedding(client: AzureOpenAI, config: ApiConfiguration, text: str, logger: Logger) -> np.ndarray:
    try:
        embedding = get_embedding(text, client, config)
        return np.array(embedding)
    except OpenAIError as e:
        logger.error(f"Error getting text embedding: {e}")
        raise

# Function to calculate cosine similarity between two vectors
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    try:
        a, b = np.array(a), np.array(b)
    except Exception:
        raise ValueError("Input vectors must be numpy arrays or convertible to numpy arrays")

    if a.shape != b.shape:
        raise ValueError("Input vectors must have the same shape")

    dot_product = np.dot(a, b)
    a_norm, b_norm = norm(a), norm(b)

    if a_norm == 0 or b_norm == 0:
        raise ValueError("Input vectors must not be zero vectors")

    return dot_product / (a_norm * b_norm)

# Function to generate enriched questions using OpenAI API
@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def generate_enriched_question(client: AzureOpenAI, config: ApiConfiguration, question: str, logger: logging.Logger) -> str:
    messages = [
        {"role": "system", "content": OPENAI_PERSONA_PROMPT},
        {"role": "user", "content": ENRICHMENT_PROMPT + "Question: " + question},
    ]
    logger.info("Making API request to OpenAI...")
    logger.info("Request payload: %s", messages)

    response = call_openai_chat(client, messages, config, logger)
    logger.info("API response received: %s", response)

    return response

# Function to process and evaluate test questions
def process_questions(client: AzureOpenAI, config: ApiConfiguration, questions: List[str], processed_question_chunks: List[dict], logger: logging.Logger) -> List[TestResult]:
    question_results = []
    
    for question in questions:
        question_result = TestResult()
        question_result.question = question
        question_result.enriched_question = generate_enriched_question(client, config, question, logger)
        embedding = get_text_embedding(client, config, question_result.enriched_question, logger)

        for chunk in processed_question_chunks:
            if isinstance(chunk, list) and chunk:
                ada_embedding = chunk[0].get("ada_v2")
                similarity = cosine_similarity(ada_embedding, embedding)

                if similarity > 0.8:
                    question_result.hit = True

                if similarity > question_result.hit_relevance:
                    question_result.hit_relevance = similarity
                    question_result.hit_summary = chunk[0].get("summary")

        question_results.append(question_result)

    logger.debug("Total tests processed: %s", len(question_results))
    return question_results

# Function to read processed chunks from the source directory
def read_processed_chunks(source_dir: str) -> List[dict]:
    processed_question_chunks = []
    for filename in os.listdir(source_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(source_dir, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                chunk = json.load(f)
                processed_question_chunks.append(chunk)
    return processed_question_chunks

# Function to save test results to a file
def save_results(test_destination_dir: str, question_results: List[TestResult]) -> None:
    output_results = [
        {
            "question": result.question,
            "enriched_question": result.enriched_question,
            "hit": result.hit,
            "summary": result.hit_summary,
            "hitRelevance": result.hit_relevance,
        }
        for result in question_results
    ]

    output_file = os.path.join(test_destination_dir, "test_output.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_results, f, indent=4)

# Main function to run tests
def run_tests(config: ApiConfiguration, test_destination_dir: str, source_dir: str, questions: List[str]) -> None:
    client = configure_openai_for_azure(config)

    if not test_destination_dir:
        logger.error("Test data folder not provided")
        exit(1)

    processed_question_chunks = read_processed_chunks(source_dir)
    question_results = process_questions(client, config, questions, processed_question_chunks, logger)
    save_results(test_destination_dir, question_results)

# Test script logic
questions = [
    "What is a Large Language Model (LLM)?",
    "How do Large Language Models (LLMs) work?",
    "What are some common use cases for Large Language Models (LLMs) in applications?",
]

config = ApiConfiguration()
test_destination_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/test output/"
source_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/data/"

if not os.path.exists(test_destination_dir):
    os.makedirs(test_destination_dir)

run_tests(config, test_destination_dir, source_dir, questions)