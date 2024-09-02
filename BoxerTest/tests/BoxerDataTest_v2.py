# BoxerDataTest_v2.py
import logging
from typing import List, Dict, Any
import os
import sys

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from common.ApiConfiguration import ApiConfiguration
from common.common_functions import get_embedding
from PersonaStrategy import DeveloperPersonaStrategy, TesterPersonaStrategy, BusinessAnalystPersonaStrategy, PersonaStrategy
from openai import AzureOpenAI, OpenAIError, BadRequestError, APIConnectionError

# Define the TestResult class
class TestResult:
    def __init__(self) -> None:
        self.question: str = ""
        self.enriched_question_summary: str = ""
        self.hit: bool = False
        self.hit_relevance: float = 0.0
        self.hit_summary: str = ""
        self.follow_up: str = ""
        self.follow_up_on_topic: str = ""

# Function to configure the Azure OpenAI API client
def configure_openai_for_azure(config: ApiConfiguration) -> AzureOpenAI:
    return AzureOpenAI(
        azure_endpoint=config.resourceEndpoint, 
        api_key=config.apiKey.strip(),
        api_version=config.apiVersion
    )

# Main test-running function
def run_tests(config: ApiConfiguration, test_destination_dir: str, source_dir: str, questions: List[str] = None, persona_strategy: PersonaStrategy = None) -> None:
    client = configure_openai_for_azure(config)

    if not test_destination_dir:
        logger.error("Test data folder not provided")
        raise ValueError("Test destination directory not provided")

    if persona_strategy:
        questions = persona_strategy.generate_questions(client, config, 3, logger)

    processed_question_chunks = read_processed_chunks(source_dir)
    question_results = process_questions(client, config, questions, processed_question_chunks, logger)
    save_results(test_destination_dir, question_results, questions)

# Function to read processed chunks from the source directory
def read_processed_chunks(source_dir: str) -> List[Dict[str, Any]]:
    processed_question_chunks = []
    try:
        for filename in os.listdir(source_dir):
            if filename.endswith(".json"):
                file_path = os.path.join(source_dir, filename)
                with open(file_path, "r", encoding="utf-8") as f:
                    chunk = json.load(f)
                    processed_question_chunks = chunk
    except (FileNotFoundError, IOError) as e:
        logger.error(f"Error reading files: {e}")
        raise
    return processed_question_chunks

# Function to process the questions
def process_questions(client: AzureOpenAI, config: ApiConfiguration, questions: List[str], processed_question_chunks: List[Dict[str, Any]], logger: logging.Logger) -> List[TestResult]:
    question_results: List[TestResult] = []
    
    for question in questions:
        question_result = TestResult()
        question_result.question = question
        question_result.enriched_question_summary = generate_enriched_question(client, config, question, logger)
        embedding = get_text_embedding(client, config, question_result.enriched_question_summary, logger)

        best_hit_relevance = 0  
        best_hit_summary = None  

        for chunk in processed_question_chunks:
            if chunk and isinstance(chunk, dict):  
                ada_embedding = chunk.get("ada_v2")
                similarity = cosine_similarity(ada_embedding, embedding)

                if similarity > SIMILARITY_THRESHOLD:
                    question_result.hit = True

                if similarity > best_hit_relevance:
                    best_hit_relevance = similarity
                    best_hit_summary = chunk.get("summary")

        question_result.hit_relevance = best_hit_relevance
        question_result.hit_summary = best_hit_summary

        question_results.append(question_result)

    logger.debug("Total tests processed: %s", len(question_results))
    return question_results

# Function to save the results and generated questions
def save_results(test_destination_dir: str, question_results: List[TestResult], questions: List[str] = None) -> None:
    output_data = {
        "test_results": [
            {
                "question": result.question,
                "enriched_question": result.enriched_question_summary,
                "hit": result.hit,
                "summary": result.hit_summary,
                "hitRelevance": result.hit_relevance,
            }
            for result in question_results
        ],
        "generated_questions": questions if questions else []
    }

    current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    output_file = os.path.join(test_destination_dir, f"test_output_v2_{current_datetime}.json")

    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=4)
        logger.info(f"Test results saved to: {output_file}")
    except IOError as e:
        logger.error(f"Error saving results: {e}")
        raise
