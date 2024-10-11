# Boxer

## Table of Contents

- [General Information](#general-information)
- [Technologies](#technologies)
- [Installation](#installation)
- [License](#license)

## General Information

Boxer is an AI-enabled Learning Management System (LMS). The objective is to be able to build a curriculum of content by processing open-source documents from the web (YouTube videos, GitHub repositories, and plan HTML text) and loading AI generated summaries into a document store. A simple front end then enables students to ask questions which the model can answer based on the embedded content. The model can also make suggestions based on content the students have interacted with.

The specific domain is to teach students how to build AI applications using modern Large Language Model (LLM) technology, and the current approaches to this - Retrieval Assisted Generation (RAG), and multi-step workflows using the LLM to generate summaries and process questions.

The benefits of this approach are:

- It is simple to maintain content, given that the field is moving so rapidly. Traditional approaches of generating bespoke new content are often obsolete by the time they are ready.
- Students get a flavour of what is possible with modern AI by using the tools.

### Benefits

- **Ease of Content Maintenance:** The system adapts to rapidly evolving AI fields by processing and summarizing current content.
- **Hands-on AI Experience:** Students explore AI capabilities firsthand through interactive tools.

## Technologies

The front end is written in Typescript, using the Microsoft Fluent UI framework: https://react.fluentui.dev/.

The messaging code uses the Microsoft Fluent Framework: [Fluid Framework Documentation](https://fluidframework.com/docs/).

There is a simple set of Node.js APIs, written to run on the Azure stack. The engine currently uses GPT-4, and the document database is created by hand-cranked Python code, using Beautiful Soup for web scraping & Google APIs for video transcripts. 

- **Frontend:** TypeScript, Microsoft Fluent UI framework ([React Fluent UI](https://react.fluentui.dev/))
- **Messaging:** Microsoft Fluent Framework ([Fluid Framework Documentation](https://fluidframework.com/docs/))
- **Backend APIs:** Node.js APIs on Azure stack
- **AI Model:** GPT-4 on Azure. 
- **Document Database:** Python with custom scripts
- **Testing:**
  -Mocha ([Mocha Documentation](https://mochajs.org/))
  -Python: pytest framework ([pytest Documentation](https://docs.pytest.org/)
- **Web Scraping:** Python, Beautiful Soup ([Python](https://www.python.org/), [Beautiful Soup Documentation](https://beautiful-soup-4.readthedocs.io/))

The key directories are:

- core – most code is here, written in plan typescript. Core has no external dependencies.
- UI – REACT UI code – written in typescript /tsx. UI depends on core.
- test – test code. Test depends on core.
- scripts - python code to download build the document database.
- data - the document database is generated into here.

By design, the app builds to a single .JS file using webpack. The JS file is then included in the production website where the app is hosted. This is currently another repo, ‘BraidWeb’.

## Installation

Follow these steps to set up your development environment for the project:

1. **Install Python 3.12.4:**

   - Download and install Python 3.12.4 from [https://www.python.org/downloads/release/python-3124/](https://www.python.org/downloads/release/python-3124/)
   - Make sure to add Python to your PATH during installation

2. **Clone the repository:**

   ```bash
   git clone https://github.com/jonverrier/BraidEng.git
   cd BraidEng
   ```

3. **Set up the upstream remote:**

   ```bash
   git remote add upstream https://github.com/jonverrier/BraidEng.git
   ```

4. **Verify the upstream remote:**

   ```bash
   git remote -v
   ```

   You should see both your origin (your fork) and the upstream repository listed:

   ```
   origin    https://github.com/YOUR_USERNAME/BraidEng.git (fetch)
   origin    https://github.com/YOUR_USERNAME/BraidEng.git (push)
   upstream  https://github.com/jonverrier/BraidEng.git (fetch)
   upstream  https://github.com/jonverrier/BraidEng.git (push)
   ```

5. **Install Visual Studio Code:**

   - Download and install VS Code from [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Open VS Code and install the following extensions:
     - Python
     - TypeScript and JavaScript Language Features
     - ESLint
     - Prettier

6. **Set up the Python virtual environment:**

   ```bash
   python -m venv venv
   ```

   Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

7. **Install Python dependencies:**

   ```bash
   pip install -r scripts/requirements.txt
   ```

8. **Install Node.js and npm:**

   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
   - npm comes bundled with Node.js

9. **Install JavaScript dependencies:**

   ```bash
   npm install
   ```

10. **Set up environment variables:**

    - Create a `.env` file in the root directory
    - Add the following environment variables:
      ```
      GOOGLE_DEVELOPER_API_KEY=your_google_api_key_here
      AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
      ```

11. **Open the project in VS Code:**

    ```bash
    code .
    ```

12. **Configure VS Code settings:**
    - Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
    - Type "Python: Select Interpreter" and choose the interpreter from your virtual environment

Now your development environment is set up and ready. Remember to keep your fork updated with the upstream repository:

```bash
git fetch upstream
git merge upstream/main
```

For more detailed information on using Git with GitHub, refer to the [GitHub documentation](https://docs.github.com/en/get-started/quickstart/set-up-git).

## Licence

GNU AFFERO GENERAL PUBLIC LICENSE.

This is intentionally a restrictive licence. The source is effectively available for non-commercial use (subject to the licence terms as listed, which enable use for learning, self study etc). Commercial use either must abide by the licence terms, which are strong, or a separate licence that enables more normal commercial use & distribution is available from Braid. Contact us for more details mailto:info@braidtechnologies.io.
