Sure, here is a mermaid diagram for the given software system explained:

```mermaid
classDiagram
    %% Define the module TestForSummariseFailApi.Types.ts
    class TestForSummariseFailApi.Types {
    }
    %% Define the ITestForSummariseFailRequest interface
    class ITestForSummariseFailRequest {
        -string text
        -optional int wordLength
    }
    %% Define the ETestForSummariseFail enum
    class ETestForSummariseFail {
        kSummaryFailed
        kSummarySucceeded
    }
    %% Define the ITestForSummariseFailResponse interface
    class ITestForSummariseFailResponse {
        -ETestForSummariseFail validationStatus
    }
    %% Define relationships for TestForSummariseFailApi.Types.ts
    TestForSummariseFailApi.Types "1" -- "1" ITestForSummariseFailRequest
    TestForSummariseFailApi.Types "1" -- "1" ETestForSummariseFail
    TestForSummariseFailApi.Types "1" -- "1" ITestForSummariseFailResponse

    %% Define the module ThemeApi.ts
    class ThemeApi {
    }
    %% Define the IFindThemeRequest interface
    class IFindThemeRequest {
        -string text
        -int length
    }
    %% Define relationships for ThemeApi.ts
    ThemeApi "1" -- "1" IFindThemeRequest
```

Explanation:
- `TestForSummariseFailApi.Types` module contains the following entities:
  - `ITestForSummariseFailRequest`: Interface outlining the structure of a request object with properties `text` and optional `wordLength`.
  - `ETestForSummariseFail`: Enum with possible results such as `kSummaryFailed` and `kSummarySucceeded`.
  - `ITestForSummariseFailResponse`: Interface defining the structure of a response object with property `validationStatus`, which uses `ETestForSummariseFail` enum.

- `ThemeApi` module contains the `IFindThemeRequest` interface, which outlines the structure for theme detection requests with properties `text` and `length`.