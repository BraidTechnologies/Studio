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

# Configure the Azure OpenAI API client
def configure_openai_for_azure(config: ApiConfiguration) -> AzureOpenAI:
    return AzureOpenAI(
        azure_endpoint=config.resourceEndpoint, 
        api_key=config.apiKey.strip(),  # Ensure the API key is stripped of any whitespace
        api_version=config.apiVersion
    )

class TestResult:
    def __init__(self) -> None:
        """
        Initializes a TestResult object with default values.
        
        Sets the initial state of the object's properties:
        - question: an empty string
        - enriched_question: an empty string
        - hit: False
        - hit_relevance: 0.0
        - hit_summary: an empty string
        - follow_up: an empty string
        - follow_up_on_topic: an empty string
        
        Returns:
            None
        """
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
            model=config.azureEmbedDeploymentName,  
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
    # Try to convert the input vectors to numpy arrays if they are not already
    try:
        a = np.array(a)
        b = np.array(b)
    except Exception:
        raise ValueError("Input vectors must be numpy arrays or convertible to numpy arrays")

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
    """
    Generate an enriched question using the OpenAI API.

    Args:
    client (AzureOpenAI): The client used to make the API request.
    config (ApiConfiguration): The configuration for the API request.
    question (str): The question to be enriched.
    logger (logging.Logger): The logger used to log the API request and response.

    Returns:
    str: The enriched question.
    """
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

@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(15), retry=retry_if_not_exception_type(BadRequestError))
def get_text_embedding(client: AzureOpenAI, config: ApiConfiguration, text: str, logger: Logger) : 
    """Get the embedding for a text"""

    embedding = get_embedding (text, client, config)
    return embedding

def run_tests(config: ApiConfiguration, test_destination_dir: str, source_dir: str, questions: List[str]) -> None:
    """Run tests with the given questions."""
    # Configure the OpenAI client
    client = configure_openai_for_azure(config)

    # Check if test_destination_dir is provided
    if not test_destination_dir:
        logger.error("Test data folder not provided")
        exit(1)

    # Read the stored chunks from the source directory
    processed_question_chunks = []
    for filename in os.listdir(source_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(source_dir, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                chunk = json.load(f)
                processed_question_chunks.append(chunk)

    # Run the tests
    question_results = []
    for question in questions:
        question_result = TestResult()
        question_result.question = question

        question_result.enriched_question = generate_enriched_question(client, config, question, logger)

        # Convert the text of the enriched question to a vector embedding
        embedding = get_text_embedding(client, config, question_result.enriched_question, logger)

        # Iterate through the stored chunks
        for chunk in processed_question_chunks:
            if isinstance(chunk, list) and chunk:  # Check if chunk is a non-empty list
                ada_embedding = chunk[0].get("ada_v2") 
                 # Access the first element of the inner list (to be check)
                similarity = cosine_similarity(ada_embedding, embedding)

                # Count it as a hit if we pass a reasonableness threshold
                if similarity > 0.8:
                    question_result.hit = True

                # Record the best match
                if similarity > question_result.hit_relevance:
                    question_result.hit_relevance = similarity
                    question_result.hit_summary = chunk[0].get("summary")

            question_results.append(question_result)

    logger.debug("Total tests processed: %s", len(question_results))

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

    # Save the test results to a JSON file
    output_file = os.path.join(test_destination_dir, "test_output.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_results, f, indent=4)


# Test script logic
questions = [
"What is a Large Language Model (LLM)?",
"How do Large Language Models (LLMs) work?",
"What are some common use cases for Large Language Models (LLMs) in applications?",
"How are Large Language Models (LLMs) different from traditional AI models?",
"What are the key components of a Large Language Model (LLM)?",
"How do Large Language Models (LLMs) process and generate text?",
"What is natural language processing (NLP)?",
"How does NLP relate to Large Language Models (LLMs)?",
"What is the difference between supervised, unsupervised, and reinforcement learning?",
"How are Large Language Models (LLMs) trained?",

"What factors should I consider when choosing a Large Language Model (LLM) for my application?",
"How do I determine the size of the model I need?"
"What are the trade-offs between smaller and larger models?",
"How do I evaluate the performance of different Large Language Models (LLMs)?",
"What are the most popular Large Language Models (LLMs) available today (eg GPT-4, BERT, T5)?",
"How does OpenAI's GPT-4 compare to other models like Google's BERT?",
"What is transfer learning and how does it apply to Large Language Models (LLMs)?",
"Can I use pre-trained models or do I need to train my own from scratch?",

"How do I integrate a Large Language Model (LLM) into my Python application?",
"What libraries or frameworks are available for working with Large Language Models (LLMs) in Python?",
"How do I use Hugging Face's Transformers library?",
"What is the process for deploying a Large Language Model (LLM)-based application?",
"How do I handle API rate limits when using a hosted Large Language Model (LLM) service?",
"How can I optimize the response time of a Large Language Model (LLM) in my application?",
"What are the best practices for managing API keys and authentication?",

"How can Large Language Models (LLMs) be used for chatbots?",
"What are the steps to create a question-answering system with a Large Language Model (LLM)?",
"How can I use a Large Language Model (LLM) to summarize text?",
"What are the methods for implementing sentiment analysis using Large Language Models (LLMs)?",
"How can Large Language Models (LLMs) be used for content generation, such as blog posts or articles?",
"What are the considerations for using Large Language Models (LLMs) in voice assistants?",
"How can Large Language Models (LLMs) assist in language translation applications?",
"What is the role of Large Language Models (LLMs) in automated code generation?",
"How can Large Language Models (LLMs) be used for data extraction from unstructured text?",

"How do I fine-tune a pre-trained Large Language Model (LLM) on my own dataset?",
"What datasets are commonly used for training Large Language Models (LLMs)?",
"How much data do I need to train or fine-tune a Large Language Model (LLM) effectively?",
"What are the computational requirements for training a Large Language Model (LLM)?",
"How do I handle bias in training data?",
"What techniques can I use to improve the accuracy of my Large Language Model (LLM)?",

"What are the ethical considerations when using Large Language Models (LLMs) in applications?",
"How can I ensure that my Large Language Model (LLM) is not producing biased or harmful content?",
"What are the privacy concerns when using Large Language Models (LLMs)?",
"How do I manage user data responsibly in a Large Language Model (LLM)-based application?",
"What are the legal implications of using Large Language Models (LLMs) in different industries?",

"How can I optimize the performance of a Large Language Model (LLM) in production?",
"What are some common performance bottlenecks when using Large Language Models (LLMs)?",
"How can I reduce the latency of Large Language Model (LLM) responses?",
"What caching strategies can I use to improve Large Language Model (LLM) response times?",
"How do I monitor and maintain a Large Language Model (LLM)-based application in production?",

"How do I estimate the cost of using a Large Language Model (LLM) in my application?",
"What are the cost considerations when choosing between different Large Language Model (LLM) providers?",
"How can I minimize the cost of API usage for Large Language Models (LLMs)?",
"What are the pricing models for popular Large Language Model (LLM) services like OpenAI's GPT?",

"How do I scale a Large Language Model (LLM)-based application to handle increased traffic?",
"What are the best practices for scaling Large Language Model (LLM) infrastructure?",
"How can I use load balancing with Large Language Models (LLMs)?",
"What cloud services are recommended for hosting Large Language Model (LLM)-based applications?",

"What security measures should I implement when using Large Language Models (LLMs)?",
"How do I protect my Large Language Model (LLM) from adversarial attacks?",
"How can I ensure secure communication between my application and the Large Language Model (LLM) API?",
"What are the risks of using Large Language Models (LLMs) and how can I mitigate them?",

"How can I customize the behavior of a Large Language Model (LLM) to better fit my application?",
"What are prompt engineering techniques and how do they work?",
"How can I use Large Language Models (LLMs) for specific domain applications, like medical or legal?",
"How do I implement contextual understanding in my Large Language Model (LLM)-based application?",
"What are the techniques for chaining Large Language Model (LLM) responses for complex tasks?",

"How do I debug issues with Large Language Model (LLM)-generated content?",
"What are the common issues faced when integrating Large Language Models (LLMs)?",
"How can I track and fix inaccuracies in Large Language Model (LLM) responses?",

"What are the latest advancements in Large Language Model (LLM) technology?",
"How do emerging models like GPT-4.5 or GPT-5 compare to GPT-4?",
"What future applications and improvements are expected for Large Language Models (LLMs)?",
"How is the field of Large Language Models (LLMs) expected to evolve over the next 5 years?",

"What online communities and forums are best for learning about Large Language Models (LLMs)?",
"What are the best courses or tutorials for learning to use Large Language Models (LLMs)?",
"How can I contribute to the development of open-source Large Language Model (LLM) projects?",

"How are Large Language Models (LLMs) used in the healthcare industry?",
"What are the applications of Large Language Models (LLMs) in finance?",
"How can Large Language Models (LLMs) benefit the education sector?",
"What are the uses of Large Language Models (LLMs) in customer service?",
"How do Large Language Models (LLMs) apply to the entertainment and media industry?",

"What are some successful case studies of Large Language Model (LLM) integration?",
"How have other developers solved common problems with Large Language Models (LLMs)?",

"What metrics should I use to evaluate the performance of my Large Language Model (LLM)?",
"How do I measure the quality of the generated text?",
"What are the methods to evaluate the relevance of Large Language Model (LLM) responses?",

"How often should I update or retrain my Large Language Model (LLM)?",
"What are the signs that my Large Language Model (LLM) needs retraining?",
"How do I manage version control for my Large Language Model (LLM) models?",

"What are the best tools for annotating and preparing training data?",
"How do I use TensorFlow or PyTorch with Large Language Models (LLMs)?",
"What is the role of the Hugging Face Model Hub in working with Large Language Models (LLMs)?",
"How can I use Docker to deploy Large Language Model (LLM)-based applications?",

"What are the GDPR implications of using Large Language Models (LLMs)?",
"How can I ensure my use of Large Language Models (LLMs) complies with industry regulations?",
"What are the copyright considerations for content generated by Large Language Models (LLMs)?",

"How can I personalize Large Language Model (LLM) interactions for individual users?",
"What strategies can I use to make Large Language Model (LLM) responses more engaging?",
"How do I gather and use user feedback to improve my Large Language Model (LLM)-based application?"]

config = ApiConfiguration()  
test_destination_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/test output/"
source_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/data/"

if not os.path.exists(test_destination_dir):
    os.makedirs(test_destination_dir)

run_tests(config, test_destination_dir, source_dir, questions)