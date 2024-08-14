'''
First version to replicate current baseline:

    ‘Generate’ 100 questions (static, copied from current test framework)

    For each question, generate the imagined document, and then do a cosine similarity lookup into the datastore to see if we have an answer, and if so, what is the cosine similarity

    Write all answers out to JSON.

    Manually open results on excel and compare to prior baseline. 

'''

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
"How are Large Language Models (LLMs) trained?"]


#write a code to read json file
def read_json_file(embeddings_file_path):        # pseudo path embeddings_file_path = data/test/embeddings_lite.json  
    with open(embeddings_file_path, 'r') as f:
        embedding_data = json.load(f)
    return embedding_data





'''
import os
from test_boxer_utility_ver1 import run_tests, get_cache_file

def main():
    config = {}  # define your config here
    source_dir = "data/test"
    off_topic_questions = []  # define your off_topic_questions here

    cache_file = get_cache_file(source_dir)
    run_tests(config, source_dir, off_topic_questions)

if __name__ == "__main__":
    main()

'''