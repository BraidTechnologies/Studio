# Standard Library Imports
import os
import sys
import logging
from typing import List  

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Local Imports
from BoxerDataTest_v1 import run_tests
from common.ApiConfiguration import ApiConfiguration

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the list of questions
questions: List[str] = [
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
    "How do I gather and use user feedback to improve my Large Language Model (LLM)-based application?"
]

# Configuration setup
config = ApiConfiguration()
test_destination_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/test output/"
source_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/data/"

# Ensure the test output directory exists
try:
    os.makedirs(test_destination_dir, exist_ok=True)
    logger.info(f"Test output directory ensured at: {test_destination_dir}")
except OSError as e:
    logger.error(f"Failed to create test output directory: {e}")
    raise

# Run the tests with error handling
try:
    logger.info("Starting the test process...")
    run_tests(config, test_destination_dir, source_dir, questions)
    logger.info("Test process completed successfully.")
except Exception as e:
    logger.error(f"An error occurred during testing: {e}")
    raise  