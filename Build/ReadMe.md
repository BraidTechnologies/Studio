# Build Scripts

This directory contains various shell scripts for building, testing, and maintaining the project's codebase. These scripts are designed to work with both TypeScript (npm) and Python (pip) projects.

## Available Scripts

### Installation and Updates
- `install_subdirs.sh`: Installs dependencies for all projects
  - For TypeScript projects: Runs `npm install`
  - For Python projects: Runs `pip install -r requirements.txt`
  - Processes all project directories

- `update_subdirs_npm.sh`: Updates npm dependencies
  - Runs `npm update --save` in directories with package.json
  - Provides reminder for updating Python packages

- `update_subdirs_pip.sh`: Updates Python dependencies
  - Updates pip packages in directories with requirements.txt

### Building and Testing
- `build_subdirs.sh`: Builds TypeScript projects
  - Executes `npm run build` in directories with package.json
  - Processes: CommonTs, Api, Cascade, WaterfallBrowser, Boxer, Teams

- `test_subdirs.sh`: Runs test suites
  - TypeScript projects: Executes `npm run test`
  - Python projects: Runs `pytest`
  - Processes all project directories

### Code Quality and Maintenance
- `check_c4_subdirs.sh`: Validates C4 model documentation
  - Ensures architectural documentation follows C4 model standards
  - Checks for required documentation elements

- `check_module_comments_subdirs.sh`: Validates code documentation
  - TypeScript: Checks for `@module` comments
  - Python: Uses pylint to verify module docstrings
  - Reports files missing proper documentation

- `clean_subdirs.sh`: Performs cleanup tasks
  - Executes `npm run clean` in directories with package.json
  - Removes build artifacts and temporary files

- `prune_subdirs.sh`: Optimizes dependencies
  - Runs `npm prune` to remove unused packages
  - Helps maintain lean dependency trees

### Analysis
- `count_loc.sh`: Analyzes codebase size
  - Counts lines of code (excluding whitespace)
  - Separates counts by language (Python, TypeScript)
  - Distinguishes between source and test files


### Evaluation
- `eval_subdirs.sh`: Runs evaluation scripts
  - Starts required services (local-fluid, func, test-warm)
  - Handles database warm-up
  - Executes evaluation scripts in specified directories
  - Includes automatic cleanup of background processes

## Project Structure

The scripts handle the following project directories:

### TypeScript Projects
- CommonTs: Common TypeScript utilities and shared code
- Api: API implementation
- Cascade: Cascade component
- WaterfallBrowser: Browser-specific Waterfall implementation
- Boxer: Boxer component
- Teams: Teams integration

### Python Projects
- CommonPy: Common Python utilities
- ApiTest: API testing framework
- Waterfall: Core Waterfall implementation
- BoxerEval: Boxer evaluation tools

## Usage

All scripts should be run from the project root directory. Examples:

```bash
# Install dependencies
./Build/install_subdirs.sh

# Build TypeScript projects
./Build/build_subdirs.sh

# Run tests
./Build/test_subdirs.sh

# Analyze code
./Build/count_loc.sh .

# Check documentation
./Build/check_module_comments_subdirs.sh
```

## Prerequisites

- Node.js 22.13 and npm for TypeScript projects
- Python 3.12.6 and pip for Python projects
- Bash shell environment

## Notes

- Always run scripts from the project root directory
- Some scripts may require administrator privileges (especially for Python package updates)
- Make scripts executable using: `chmod +x Build/*.sh`