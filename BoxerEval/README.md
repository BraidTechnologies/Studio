# BoxerEval

BoxerEval is a testing framework for evaluating and generating AI-assisted questions using Azure OpenAI services. The framework supports multiple persona-based testing strategies and includes robust evaluation mechanisms.

## 🌟 Features

- Generate enriched questions using GPT models
- Calculate similarity embeddings using OpenAI's embedding models
- Support for multiple professional personas (Developer, Tester, Business Analyst)
- Quality evaluation using Google's Gemini model
- Robust retry mechanisms for API calls
- Comprehensive logging system
- Configurable test scenarios

## 🏗️ Architecture

The project consists of several key components:

### Core Testing Modules (v1-v5)
- `BoxerDataTest_v1.py` through `BoxerDataTest_v5.py`: Progressive versions of the testing framework
- Latest version (`v5`) includes enhanced features like follow-up question generation and improved evaluation metrics

### Supporting Components
- `GeminiEvaluator.py`: Evaluates generated content quality using Google's Gemini LLM
- `PersonaStrategy.py`: Implements different professional personas for question generation
- `TestRunner.py`: CLI interface for running different test scenarios

## 🚀 Getting Started

1. **Setup Environment**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Install dependencies
   pip install azure-openai numpy tenacity google-generative-ai
   ```

2. **Configure API Keys**
   - Set up Azure OpenAI API credentials
   - Configure Google Gemini API key (for evaluation)

3. **Run Tests**
   ```bash
   python TestRunner.py
   ```

## 💻 Usage

The framework supports two main testing modes:

1. **Static Question Tests**
   ```python
   from BoxerDataTest_v5 import run_tests
   run_tests(config, test_destination_dir, source_dir, num_questions, questions, None)
   ```

2. **Persona-Based Tests**
   ```python
   from PersonaStrategy import DeveloperPersonaStrategy
   run_tests(config, test_destination_dir, source_dir, num_questions, None, DeveloperPersonaStrategy())
   ```

## 📊 Output

Test results are saved in JSON format, including:
- Enriched questions
- Follow-up questions
- Similarity scores
- Quality evaluations

## 🔧 Configuration

The framework uses `ApiConfiguration` class to manage:
- API endpoints
- Model selections
- Retry settings
- Logging configurations




