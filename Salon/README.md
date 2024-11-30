**Salon** is a technology demonstrator for automated software development tools using LLMs. 

**api_to_test_code** takes an input file in a JSON format or in YAML format that has been generated from an API. It generates Python source code to test the API. In the case of Braid, post-processed code is used in **ApiTest** to demonstate how this achieves excellent test coverage for low input effort. 

**repo_to_text** processes a directory of source code and concatenates the source into a set of text files. These text files can be uploaded into an LLM, which can then be used to anwer questions about the code. 

The code is copied (with some amendments to make it work on a large mono-repo) from the following blog post:
https://jmlbeaujour.medium.com/introducing-notebooklm-as-a-solution-for-interactive-code-exploration-704a44e690a6


