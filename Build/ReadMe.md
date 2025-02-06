# Build Scripts

This directory contains various shell scripts for building, testing, and maintaining the project's codebase.

## Available Scripts

### Building
- `build_subdirs.sh`: Executes `npm run build` in all TypeScript project directories that contain a package.json file.
  - Processes: CommonTs, Api, Cascade, WaterfallBrowser, Boxer, Teams

### Testing
- `test_subdirs.sh`: Runs tests across all project directories
  - For TypeScript projects: Executes `npm run test`
  - For Python projects: Runs `pytest`
  - Processes: CommonTs, CommonPy, Api, ApiTest, Cascade, Waterfall, WaterfallBrowser, Boxer, Teams

### Maintenance
- `clean_subdirs.sh`: Runs cleanup tasks in all directories containing package.json
  - Executes `npm run clean` in each directory
  
- `prune_subdirs.sh`: Removes unused dependencies
  - Executes `npm prune` in directories with package.json

### Analysis
- `count_loc.sh`: Counts lines of code (excluding whitespace)
  - Counts both source and test files
  - Separates counts for Python (.py) and TypeScript (.ts, .tsx)
  - Usage: `./count_loc.sh <base_directory>`

- `check_module_comments_subdirs.sh`: Validates module documentation
  - TypeScript: Checks for `@module` comments
  - Python: Uses pylint to check for module docstrings
  - Reports files missing proper documentation

## Project Structure
The scripts handle the following project directories:

### TypeScript Projects
- CommonTs
- Api
- Cascade
- WaterfallBrowser
- Boxer
- Teams

### Python Projects
- CommonPy
- ApiTest
- Waterfall
- BoxerEval

## Usage

All scripts should be run from the project root directory. For example:

bash
./Build/build_subdirs.sh
./Build/test_subdirs.sh
./Build/count_loc.sh .

bash
chmod +x Build/.sh