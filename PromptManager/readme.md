# Prompt Manager

A centralized system for managing and maintaining LLM prompts across Python and TypeScript applications. By serving as a shared dependency between projects, it provides a single source of truth for prompts, ensuring they remain consistent and high-quality throughout the codebase.

## Features

- Shared JSON schema for prompts across Python and TypeScript
- Automatic synchronization between Python and TypeScript models
- Organized prompt collections by domain/purpose
- Easy importing and usage in both languages

## Structure
Common JSON Interface, CommonJSON Schema for Prompts, Separate Helper Packages


# Prompt Manager

A repository for managing and sharing prompts across Python and TypeScript LLM applications.

## Key Features for best balance between simplicity and type safety

- Language-agnostic JSON schema for prompt definitions
- Bidirectional sync between Python and TypeScript type models
- Domain-organized prompt collections
- Simple integration with both Python and TypeScript projects

## Attributes

- Common JSON Interface for schema 
- Common JSON Schema for Prompts  
- Separate Helper Packages for Python and TypeScript

## Installation

### TypeScript Projects

1. Install and Link the package:

```bash
npm install /path/to/PromptManager/ts-client
``` 

2. Use the prompts in your TypeScript project:

```typescript
import { greeting } from "PromptManager/ts-client/entry";
console.log(greeting.content);  // Outputs: "Hello! How can I help you today?"
``` 

### Python Projects

1. Install and Link the package:

```bash
pip install -e /path/to/PromptManager/python-client
```

2. Use the prompts in your Python project:

```python
from PromptManager.python-client.entry import greeting  # Direct import
print(greeting["content"])  # Outputs: "Hello! How can I help you today?"
``` 

## Prompt Collection Structure

Prompts are organized into domain-specific collections:

```
PromptManager/
├── interfaces/
├── prompts/
├── ts-client/
│ ├── entry.ts
│ ├── helpers/
├── python-client/
│ ├── entry.py
│ ├── helpers/
│ 


