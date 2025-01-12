```mermaid
flowchart TB
    subgraph Salon
        subgraph api_to_test_code
            A1[parse_arguments]
            A2[extract_code]
            A3[load_api_data]
            A4[main]
            A5[error handling and logging]
        end
        subgraph repo_to_text
            B1[SummarisedDirectory]
            B2[load_yaml(fname)]
            B3[summarise_endpoint_url]
            B4[summarise_code(source)]
            B5[RepoContentProcessor]
            B6[parse_arguments()]
            B7[validate_args(args)]
        end
        subgraph repo_to_c4.py
            C1[repo traversal and file processing]
            C2[summarise_endpoint_url()]
            C3[summarise_code()]
            C4[RepoToC4]
            C5[parse_arguments()]
            C6[validate_args()]
            C7[main()]
            C8[generate C4 diagrams]
        end
        subgraph UnitTests
            D1[PagerepositoryApi.Types_test.py]
        end
        classDef box fill:#f9f,stroke:#333,stroke-width:4px;
        api_to_test_code:::box
        repo_to_text:::box
        repo_to_c4.py:::box
        UnitTests:::box
        
        B5 <--> B2
        B5 <--> B4
        B5 <--> B6
        B5 <--> B7
        C4 <--> C1
        C4 <--> C2
        C4 <--> C3
        C4 <--> C5
        C4 <--> C6
        C4 <--> C7
        C4 <--> C8
    end
```