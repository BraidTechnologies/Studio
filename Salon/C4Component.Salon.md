```mermaid
---
title: Salon System Components
---
C4Context
    boundary System_Boundary {
        System(salon, "Salon", "Automated Software Development Tools") {
            Component(api_to_test_code, "API to Test Code", "Generates Python test code from API specs")
            Component(repo_to_text, "Repo to Text", "Processes and analyzes codebases")
            
            Component(api_to_test_code_script, "api_to_test_code.py", "Generates Pytest code from API specifications")
            component_a <- group Container(api_to_test_code, &) {
                Component(parse_arguments_1, "parse_arguments")
                Component(extract_code, "extract_code")
                Component(load_api_data, "load_api_data")
                Component(main_api, "main")
            }

            Component(repo_to_text_script, "repo_to_text.py", "Processes and analyzes codebases")
            component_b <- group Container(repo_to_text, &) {
                Component(SummarisedDirectory, "SummarisedDirectory")
                Component(RepoContentProcessor, "RepoContentProcessor", "
                    - `__init__`
                    - `make_common_file_name`
                    - `format_file_block`
                    - `count_words`
                    - `is_in_git_directory`
                    - `is_skip_dir`
                    - `is_in_common_dir`
                    - `should_resummarise_code`
                    - `save_current_content`
                    - `process_file`
                    - `process_repo`
                ")
                Component(summarise_code, "summarise_code")
                Component(load_yaml, "load_yaml")
                Component(main_repo, "main")
                Component(parse_arguments_2, "parse_arguments")
                Component(validate_args, "validate_args")
            }
        }
    }
```