# Copyright (c) 2024 Braid Technologies Ltd
# Standard Library Imports
import os
import sys
import logging
from typing import List, Dict, Any

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Local Imports
from BoxerDataTest_v1 import run_tests                           # use this for v1
# from BoxerDataTest_v2 import run_tests                             # use this for v2
from common.ApiConfiguration import ApiConfiguration

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the list of questions
questions: List[str] = [
    'How are LLMs different from traditional AI models?',
    'What is a Large Language Model (LLM)?',
    'What is natural language processing (NLP)?',
    'What are prompt engineering techniques and how do they work?',
    'What is the difference between supervised, unsupervised, and reinforcement learning?',
    'How can LLMs be used for chatbots?',
    'What are the considerations for using LLMs in voice assistants?',
    "What are the pricing models for popular LLM services like OpenAI's GPT?",
    "How does OpenAI's GPT-4 compare to other models like Google's BERT?",
    "How do I use Hugging Face's Transformers library?",
    'How does NLP relate to LLMs?',
    'What are the methods for implementing sentiment analysis using LLMs?',
    'What are the computational requirements for training an LLM?',
    'How do I handle bias in training data?',
    'How can LLMs assist in language translation applications?',
    'What are the techniques for chaining LLM responses for complex tasks?',
    'What is the role of LLMs in automated code generation?',
    'What is the role of the Hugging Face Model Hub in working with LLMs?',
    'How can LLMs be used for content generation, such as blog posts or articles?',
    'How can LLMs be used for data extraction from unstructured text?',
    'How do I fine-tune a pre-trained LLM on my own dataset?',
    'How do I use TensorFlow or PyTorch with LLMs?',
    'What is transfer learning and how does it apply to LLMs?',
    'How do emerging models like GPT-4.5 or GPT-5 compare to GPT-4?',
    'How much data do I need to train or fine-tune an LLM effectively?',
    'How do I implement contextual understanding in my LLM-based application?',
    'What are some common use cases for LLMs in applications?',
    'How do LLMs process and generate text?',
    'What are the steps to create a question-answering system with an LLM?',
    'What are the latest advancements in LLM technology?',
    'What are the most popular LLMs available today (eg GPT-4, BERT, T5)?',
    'How are LLMs trained?',
    'What future applications and improvements are expected for LLMs?',
    'What are the uses of LLMs in customer service?',
    'What are the common issues faced when integrating LLMs?',
    'What datasets are commonly used for training LLMs?',
    'What are the best practices for scaling LLM infrastructure?',
    'How do I gather and use user feedback to improve my LLM-based application?',
    'What are the GDPR implications of using LLMs?',
    'How do LLMs work?',
    'What are the privacy concerns when using LLMs?',
    'What are the risks of using LLMs and how can I mitigate them?',
    'What are the key components of an LLM?',
    'How do I scale an LLM-based application to handle increased traffic?',
    'What is the process for deploying an LLM-based application?',
    'What are some common performance bottlenecks when using LLMs?',
    'How have other developers solved common problems with LLMs?',
    'How do I monitor and maintain an LLM-based application in production?',
    'How can I use LLMs for specific domain applications, like medical or legal?',
    'What metrics should I use to evaluate the performance of my LLM?',
    'How do I handle API rate limits when using a hosted LLM service?',
    'What are the best courses or tutorials for learning to use LLMs?',
    'How do I evaluate the performance of different LLMs?',
    'How can LLMs benefit the education sector?',
    'What cloud services are recommended for hosting LLM-based applications?',
    'How can I use an LLM to summarize text?',
    'How can I minimize the cost of API usage for LLMs?',
    'What techniques can I use to improve the accuracy of my LLM?',
    'What are the methods to evaluate the relevance of LLM responses?',
    'What are the legal implications of using LLMs in different industries?',
    'What are the ethical considerations when using LLMs in applications?',
    'How can I optimize the performance of an LLM in production?',
    'How can I personalize LLM interactions for individual users?',
    'How is the field of LLMs expected to evolve over the next 5 years?',
    'How often should I update or retrain my LLM?',
    'How do I measure the quality of the generated text?',
    'Can I use pre-trained models or do I need to train my own from scratch?',
    'How can I use load balancing with LLMs?',
    'How are LLMs used in the healthcare industry?',
    'What security measures should I implement when using LLMs?',
    'What are the best tools for annotating and preparing training data?',
    'How can I customize the behavior of an LLM to better fit my application?',
    'How can I contribute to the development of open-source LLM projects?',
    'What online communities and forums are best for learning about LLMs?',
    'What are the copyright considerations for content generated by LLMs?',
    'How do I manage version control for my LLM models?',
    'What are some successful case studies of LLM integration?',
    'What are the applications of LLMs in finance?',
    'What strategies can I use to make LLM responses more engaging?',
    'What libraries or frameworks are available for working with LLMs in Python?',
    'How can I use Docker to deploy LLM-based applications?',
    'What factors should I consider when choosing an LLM for my application?',
    'How do I estimate the cost of using an LLM in my application?',
    'What are the signs that my LLM needs retraining?',
    'What are the cost considerations when choosing between different LLM providers?',
    'How can I ensure that my LLM is not producing biased or harmful content?',
    'How do I integrate an LLM into my Python application?',
    'How can I ensure my use of LLMs complies with industry regulations?',
    'How do I manage user data responsibly in an LLM-based application?',
    'How do LLMs apply to the entertainment and media industry?',
    'How do I protect my LLM from adversarial attacks?',
    'How do I debug issues with LLM-generated content?',
    'How can I optimize the response time of an LLM in my application?',
    'How can I ensure secure communication between my application and the LLM API?',
    'How can I reduce the latency of LLM responses?',
    'How do I determine the size of the model I need?What are the trade-offs between smaller and larger models?',
    'What caching strategies can I use to improve LLM response times?',
    'How can I track and fix inaccuracies in LLM responses?',
    'What are the best practices for managing API keys and authentication?'
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