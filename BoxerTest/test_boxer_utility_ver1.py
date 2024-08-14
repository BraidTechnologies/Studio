"""
This script processes a list of questions through the test pipeline.
"""
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json

# Third-Party Packages
import openai
from openai import AzureOpenAI, BadRequestError
from tenacity import retry, wait_random_exponential, stop_after_attempt, retry_if_not_exception_type
import numpy as np
from numpy.linalg import norm

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



class TestResult:
    def __init__(self) -> None:
        self.question = ""
        self.enriched_question = ""        
        self.hit = False 
        self.hit_relevance = 0.0
        self.hit_summary = ""
        self.follow_up = ""
        self.follow_up_on_topic = ""

def create_openai_client(config: ApiConfiguration) -> AzureOpenAI:
    """Create and return an AzureOpenAI client instance."""
    return AzureOpenAI(
        azure_endpoint=config.resourceEndpoint, 
        api_key=config.apiKey,  
        api_version=config.apiVersion,
    )

def call_openai_chat(client: AzureOpenAI, config: ApiConfiguration, messages: list, logger: logging.Logger) -> str:
    """Generic function to call OpenAI chat and handle responses."""
    response = client.chat.completions.create(
        model=config.azureDeploymentName,
        messages=messages,
        temperature=0.7,
        max_tokens=config.maxTokens,
        top_p=0.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
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

@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def generate_enriched_question(client: AzureOpenAI, config: ApiConfiguration, question: str, logger: logging.Logger) -> str:
    """Generate an enriched question using OpenAI's GPT model."""
    messages = [
        {"role": "system", "content": OPENAI_PERSONA_PROMPT},
        {"role": "user", "content": ENRICHMENT_PROMPT + "Question: " + question},
    ]
    return call_openai_chat(client, config, messages, logger)

@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def generate_followup_question(client: AzureOpenAI, config: ApiConfiguration, summary: str, logger: logging.Logger) -> str:
    """Generate a follow-up question based on the provided text."""
    messages = [
        {"role": "system", "content": FOLLOW_UP_PROMPT},
        {"role": "user", "content": "Article summary: " + summary},
    ]
    return call_openai_chat(client, config, messages, logger)

@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def assess_followup_relevance(client: AzureOpenAI, config: ApiConfiguration, followup_question: str, logger: logging.Logger) -> str:
    """Assess whether the follow-up question is on-topic about AI."""
    messages = [
        {"role": "system", "content": "You are an AI assistant helping a team of developers understand AI. You explain complex concepts in simple language. You will be asked a question. Respond 'yes' if the question appears to be about AI, otherwise respond 'no'."},
        {"role": "user", "content": followup_question},
    ]
    return call_openai_chat(client, config, messages, logger)

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float: 
    return np.dot(a, b) / (norm(a) * norm(b))

def run_tests(config: ApiConfiguration, test_destination_dir: str, source_dir: str, questions: list) -> None:
    """Run tests with the given questions."""

    logging.basicConfig(level=logging.WARNING)
    logger = logging.getLogger(__name__)

    client = create_openai_client(config)
   
    if not test_destination_dir:
        logger.error("Test data folder not provided")
        exit(1)

    results = []

    # Load existing chunks from a JSON file
    cache_file = os.path.join(source_dir, "embeddings_lite.json")
    current_chunks = []
    if os.path.isfile(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            current_chunks = json.load(f)       

    logger.info("Starting test run, total questions to be processed: %s", len(questions))

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

        # Ask GPT for a follow-up question on the best match
        # Then assess if the follow-up is about AI            
        result.follow_up = generate_followup_question(client, config, result.hit_summary, logger)
        result.follow_up_on_topic = assess_followup_relevance(client, config, result.follow_up, logger)            

        results.append(result)

    logger.debug("Total tests processed: %s", len(results))

    output_results = [
        {
            "question": result.question,
            "enriched_question": result.enriched_question,
            "hit": result.hit,
            "summary": result.hit_summary,
            "hitRelevance": result.hit_relevance,
            "followUp": result.follow_up,
            "followUpOnTopic": result.follow_up_on_topic,
        }
        for result in results
    ]
      
    # Save the test results to a JSON file
    output_file = os.path.join(test_destination_dir, "test_output.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_results, f, indent=4)


# write a test loop here 
'''

take as input 100 questiones from a python data structure

For each question, generate the imagined document, and then do a cosine similarity lookup into the datastore ( data store location as per me: data/test/embeddings_lite.json) to see if we have an answer, and if so, what is the cosine similarity

Write all answers out to JSON.

I want to  Manually open results on excel and compare to prior baseline. 

'''



def test_boxer_utility_ver1_test_loop(questions):
    # Initialize logging
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(logging.StreamHandler())

    # Load the test embeddings
    embeddings_file = os.path.join(os.path.dirname(__file__), "..", "data", "test", "embeddings_lite.json")  #the location of this file in the current moment in the repo is unknown 
    with open(embeddings_file, "r", encoding="utf-8") as f:
        embeddings = json.load(f)

    # Initialize results list
    results = []

    # Iterate over the questions
    for question in questions:
        result = {}

        # Generate the imagined document
        result["question"] = question
        result["imagined_document"] = generate_imagined_document(question)
        logger.debug("Imagined document: %s", result["imagined_document"])

        # Find the best match in the embeddings
        best_match = find_best_match(embeddings, result["imagined_document"])
        result["best_match"] = best_match["document"]
        result["cosine_similarity"] = best_match["cosine_similarity"]
        logger.debug("Best match: %s (cosine similarity: %s)", result["best_match"], result["cosine_similarity"])

        results.append(result)

    # Save the test results to a JSON file
    output_file = os.path.join(os.path.dirname(__file__), "..", "data", "test", "test_output_ver1.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)



def find_best_match(embeddings, document):
    # Find the best match by calculating the cosine similarity between the document embeddings
    best_match = None
    best_cosine_similarity = 0.0
    for embedding in embeddings:
        cosine_similarity = np.dot(embedding["embedding"], document) / (norm(embedding["embedding"]) * norm(document))
        if cosine_similarity > best_cosine_similarity:
            best_match = embedding
            best_cosine_similarity = cosine_similarity
    return {"document": best_match["document"], "cosine_similarity": best_cosine_similarity}





























'''
import os
import json
import logging
from logging import Logger

import openai
from openai import AzureOpenAI
from openai import BadRequestError

from tenacity import (
    retry,
    wait_random_exponential,
    stop_after_attempt,
    retry_if_not_exception_type,
)
from rich.progress import Progress
import numpy as np
from numpy.linalg import norm
import sys 

# Add the parent directory of the test file to the Python path for importing modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from scripts.common.ApiConfiguration import ApiConfiguration
from scripts.common.common_functions import get_embedding

# Constants for prompts used in generating and assessing questions
kOpenAiPersonaPrompt = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'."
kEnrichmentPrompt = "You will be provided with a question about building applications that use generative AI technology. Write a 50 word summary of an article that would be a great answer to the question. Consider enriching the question with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n"
kFollowUpPrompt = "You will be provided with a summary of an article about building applications that use generative AI technology. Write a question of no more than 10 words that a reader might ask as a follow up to reading the article."

class TestResult:
    """Class to store and manage the result of a test case."""
    
    def __init__(self, question: str) -> None:
        self.question = question
        self.enriched_question = ""
        self.hit = False
        self.hit_relevance = 0.0
        self.hit_summary = ""
        self.follow_up = ""
        self.follow_up_on_topic = ""

def get_enriched_question(client: AzureOpenAI, config: ApiConfiguration, text: str, logger: Logger) -> str:
    """Generate an enriched question using AzureOpenAI's chat completion."""
    
    messages = [
        {"role": "system", "content": kOpenAiPersonaPrompt},
        {"role": "user", "content": kEnrichmentPrompt + text},
    ]

    response = client.chat.completions.create(
        model=config.azureDeploymentName,
        messages=messages,
        temperature=0.7,
        max_tokens=config.maxTokens,
        top_p=0.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        timeout=config.openAiRequestTimeout
    )

    text = response.choices[0].message.content
    finish_reason = response.choices[0].finish_reason

    if finish_reason not in {"stop", "length", ""}:
        logger.warning(f"Unexpected finish reason: {finish_reason}")
        logger.warning(f"Text: {text}")
        exit(1)

    return text

@retry(
    wait=wait_random_exponential(min=5, max=15),
    stop=stop_after_attempt(15),
    retry=retry_if_not_exception_type(openai.BadRequestError),
)
def get_text_embedding(client: AzureOpenAI, config: ApiConfiguration, text: str, logger: Logger) -> np.ndarray:
    """Get the text embedding using the configured API client."""
    
    return get_embedding(text, client, config)

@retry(
    wait=wait_random_exponential(min=5, max=15),
    stop=stop_after_attempt(15),
    retry=retry_if_not_exception_type(openai.BadRequestError),
)
def get_followup_question(client: AzureOpenAI, config: ApiConfiguration, summary: str, logger: Logger) -> str:
    """Generate a follow-up question based on the article summary."""
    
    messages = [
        {"role": "system", "content": kFollowUpPrompt},
        {"role": "user", "content": summary},
    ]

    response = client.chat.completions.create(
        model=config.azureDeploymentName,
        messages=messages,
        temperature=0.7,
        max_tokens=config.maxTokens,
        top_p=0.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        timeout=config.openAiRequestTimeout
    )

    text = response.choices[0].message.content
    finish_reason = response.choices[0].finish_reason

    if finish_reason not in {"stop", "length", ""}:
        logger.warning(f"Unexpected finish reason: {finish_reason}")
        logger.warning(f"Text: {text}")
        exit(1)

    return text

@retry(
    wait=wait_random_exponential(min=5, max=15),
    stop=stop_after_attempt(15),
    retry=retry_if_not_exception_type(openai.BadRequestError),
)
def assess_followup_question(client: AzureOpenAI, config: ApiConfiguration, question: str, logger: Logger) -> str:
    """Assess whether the follow-up question is on-topic (related to AI)."""
    
    messages = [
        {
            "role": "system",
            "content": "You are an AI assistant. You will be asked a question. Respond 'yes' if the question appears to be about AI, otherwise respond 'no'."
        },
        {"role": "user", "content": question},
    ]

    response = client.chat.completions.create(
        model=config.azureDeploymentName,
        messages=messages,
        temperature=0.7,
        max_tokens=config.maxTokens,
        top_p=0.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        timeout=config.openAiRequestTimeout
    )

    return response.choices[0].message.content

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Calculate the cosine similarity between two vectors."""
    
    return np.dot(a, b) / (norm(a) * norm(b))

def run_tests(config: ApiConfiguration, test_destination_dir: str, source_dir: str, questions: list) -> None:
    """Run tests on a set of questions, comparing results against a stored baseline."""
    
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    client = AzureOpenAI(
        azure_endpoint=config.resourceEndpoint,
        api_key=config.apiKey,
        api_version=config.apiVersion,
    )

    if not test_destination_dir:
        logger.error("Test destination directory not provided.")
        exit(1)

    results = []

    # Load the existing chunks from a JSON file
    cache_file = os.path.join(source_dir, "embeddings_lite.json")
    if os.path.isfile(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            existing_chunks = json.load(f)

    logger.info(f"Starting test run with {len(questions)} questions.")

    for question in questions:
        result = TestResult(question)
        result.enriched_question = get_enriched_question(client, config, question, logger)

        # Convert the text of the enriched question to a vector embedding
        embedding = get_text_embedding(client, config, result.enriched_question, logger)

        for chunk in existing_chunks:
            ada_embedding = chunk.get("ada_v2")
            similarity = cosine_similarity(ada_embedding, embedding)

            if similarity > 0.8:
                result.hit = True

            if similarity > result.hit_relevance:
                result.hit_relevance = similarity
                result.hit_summary = chunk.get("summary")

        result.follow_up = get_followup_question(client, config, result.hit_summary, logger)
        result.follow_up_on_topic = assess_followup_question(client, config, result.follow_up, logger)

        results.append(result)

    logger.info(f"Test run completed. Total questions processed: {len(results)}.")

    # Prepare the results for JSON output
    output_results = [
        {
            "question": result.question,
            "enriched_question": result.enriched_question,
            "hit": result.hit,
            "summary": result.hit_summary,
            "hit_relevance": result.hit_relevance,
            "follow_up": result.follow_up,
            "follow_up_on_topic": result.follow_up_on_topic,
        }
        for result in results
    ]

    # Save the test results to a JSON file
    output_file = os.path.join(test_destination_dir, "test_output.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_results, f)



#Running the test: 
# Running the test:

import json
from scripts.common.ApiConfiguration import ApiConfiguration  # Adjust the import path as necessary

# Define your configuration by simply instantiating the class
config = ApiConfiguration()

# Define directories
testDestinationDir = '/path/to/output'
sourceDir = '/path/to/source'

# Define or load your list of questions
questions = [
    "What is the impact of AI on software development?",
    "How does generative AI differ from traditional machine learning?",
    "What are the best practices for deploying large language models?",
    # Add more questions as needed
]

# Run the tests with the provided questions
run_tests(config, testDestinationDir, sourceDir, questions)

'''
