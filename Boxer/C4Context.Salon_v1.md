### Archie Diagram: Boxer - AI-Powered Chat Application Architecture

```mermaid
C4Context
    title Boxer - AI-Powered Chat Application Architecture

    Person(user, "User", "Interacts with the chat application")
    Person(admin, "Administrator", "Manages the application")

    System_Boundary(app, "Boxer Application") {
        System(chatApp, "Chat Application", "Provides real-time chat functionality with AI capabilities")

        System_Ext(LLMService, "Large Language Model Service", "Processes natural language queries")
        System_Ext(fluidFramework, "Fluid Framework", "Manages real-time collaboration and state synchronization")
        System_Ext(cosmosDb, "Cosmos DB", "Persist data for activity tracking")
    }

    Rel(user, chatApp, "uses")
    Rel(admin, chatApp, "manages")
    Rel(chatApp, LLMService, "Sends natural language queries")
    Rel(chatApp, fluidFramework, "Real-time state synchronization")
    Rel(chatApp, cosmosDb, "Persist activity data")
```

### Source Code Pipeline Diagrams

The following are detailed diagrams representing various components and their relationships within the Boxer codebase.

#### GitHub Data Flow

```mermaid
graph TD

%% GitHub Data Flow
subgraph GitHub_Pipeline
    direction TB
    A[MARKDOWN_DESTINATION_DIR] -->|set directory| B(ApiConfiguration)
    B -->|create config object| C[download_markdown]
    C -->|input: gitHubUrls, output: markdown files in directory| D[MARKDOWN_DESTINATION_DIR]

    %% Enrichment Steps
    subgraph Enrichment
        E[enrich_text_chunks]
        F[enrich_text_summaries]
        G[enrich_text_embeddings]
        H[enrich_lite]
    end
    
    D -->|process files| Enrichment
    E --> D
    F --> D
    G --> D
    H --> D

    D -->|count URL hits| I[countUrlHits]
    I --> J[output JSON files]
end
```

#### Make New Container Test

```mermaid
graph TD

%% Make New Container Test
subgraph make_new_container.ts
    direction TB
    K[Test Suite: Make new container]
    K --> L[Persona]
    K --> M[BraidFluidConnection]
    K --> N[SessionKey]

    K -->|initialize| P[Create and verify session, create container]
end
```

#### Web Pipeline

```mermaid
graph TD

%% Web Pipeline
subgraph web_pipeline.py
    direction TB
    O[HTML_DESTINATION_DIR] -->|ensure directory exists| B
    B -->|create config object| Q[download_html]
    Q -->|input: webUrls, output: HTML files in directory| O

    %% Enrichment Steps
    subgraph Enrichment_Web
        R[enrich_text_chunks]
        S[enrich_text_summaries]
        T[enrich_text_embeddings]
        U[enrich_lite]
    end

    O -->|process files| Enrichment_Web
    R --> O
    S --> O
    T --> O
    U --> O

    O -->|count URL hits| V[countUrlHits]
    V --> W[ENRICHMENT_OUTPUT_DIR]
end
```

#### YouTube Pipeline

```mermaid
graph TD

%% YouTube Pipeline
subgraph youtube_pipeline.py
    direction TB
    X[TRANSCRIPT_DESTINATION_DIR] -->|ensure directory exists| B
    B -->|create config object| AA[download_transcripts]
    AA -->|input: youTubeUrls, output: transcript files in directory| X

    %% Enrichment Steps
    subgraph Enrichment_Youtube
        AB[enrich_transcript_chunks]
        AC[enrich_transcript_summaries]
        AD[enrich_transcript_embeddings]
        AE[enrich_lite]
    end

    X -->|process files| Enrichment_Youtube
    AB --> X
    AC --> X
    AD --> X
    AE --> X

    X -->|count URL hits| AF[countUrlHits]
    AF --> AG[ENRICHMENT_OUTPUT_DIR]
end
```

#### UI Component: AnimatedIconButton.tsx

```mermaid
graph TD

%% UI Component: AnimatedIconButton.tsx
subgraph AnimatedIconButton.tsx
    direction TB
    AH[AnimatedIconButton]
    AH --> AI[EAnimatedIconButtonTypes]
    AH -->|manage state| AJ[useForceUpdate]
    AH --> AK[animatedColourSequence]
    AH --> AL[Menu, Icon, Button]
    AH --> AM[staticColourSequence]
end
```

#### UI Component: AppEntry.tsx

```mermaid
graph TD

%% UI Component: AppEntry.tsx
subgraph AppEntry.tsx
    direction TB
    AN[AppEntry]
    AN --> AO[Persona]
    AN -->|manage state| AP[useState]
    AN --> AQ[SessionKey]
    AN --> AR[URLs Handling]
    AN -->|render| AS[MainPageMessageRow, ConversationControllerRow, JoinPane]

    AN -->|error handling| AT[onConnectError, onFluidError, onAiError]
end
```

#### UI Component: ColumnStyles.tsx

```mermaid
graph TD

%% UI Component: ColumnStyles.tsx
subgraph ColumnStyles.tsx
    direction TB
    AU[ColumnStyles]
    AU -->|create styles| AV[innerColumnStyles]
    AU -->|create mid styles| AW[innerColumnMidStyles]
    AU -->|create footer styles| AX[innerColumnFooterStyles]
    AU -->|text field styles| AY[textFieldStyles]
end
```

#### UI Component: ConversationController.tsx

```mermaid
graph TD

%% UI Component: ConversationController.tsx
subgraph ConversationController.tsx
    direction TB
    AZ[ConversationController]
    AZ --> BA[ConversationControllerRow]
    AZ -->|initialize| BB[initialiseConnectionState]
    AZ -->|manage state| BC[useState]

    subgraph User Actions
        BD[addMessage]
        BE[initialiseConnectionState]
        BF[onSend]
        BG[onCancelSuggestedContent]
        BH[onStreamedUpdate]
    end

    AZ --> User Actions
    User Actions --> BI[Update/Manage UI]
end
```

#### UI Component: ConversationMessagePrompt.tsx

```mermaid
graph TD

%% UI Component: ConversationMessagePrompt.tsx
subgraph ConversationMessagePrompt.tsx
    direction TB
    BJ[ConversationMessagePrompt]
    BJ -->|define properties| BK[IMessagePromptProps]
    
    BJ -->|calculate height| BL[wrapText, calculateDyNeeded]
    BJ -->|manage state| BM[useState]

    BJ -->|handle events| BN[onInputChange, onKeyPress]
    BJ -->|render| BO[textarea input]
end
```

#### UI Component: ConversationPane.tsx

```mermaid
graph TD

%% UI Component: ConversationPane.tsx
subgraph ConversationPane.tsx
    direction TB
    BP[ConversationPane]
    BP -->|define properties| BQ[IConversationHeaderProps, IConversationViewProps, ISingleMessageViewProps, IAuthorIconProps, IRelevantChunkProps]

    BP -->|Header Row| BR[ConversationHeaderRow]
    BP -->|View| BS[ConversationView]
    BP -->|split text| BT[splitByDoubleNewline]
    BP -->|Relevant Chunks| BU[RelevantChunkView]
    BP -->|Single Message| BV[SingleMessageView]
    BP -->|Input View| BW[InputView]
end
```

#### UI Component: JoinPane.tsx

```mermaid
graph TD

%% UI Component: JoinPane.tsx
subgraph JoinPane.tsx
    direction TB
    BX[JoinPane]
    BX -->|manage state| BY[useState]
    BX -->|define handlers| BZ[onConversationSelect, onKeyChange, onTryJoin]

    BX -->|create styles| CA[makeStyles]
    BX -->|map keys| CB[conversationKeyFromName]
end
```

#### UI Component: MainPageMessage.tsx

```mermaid
graph TD

%% UI Component: MainPageMessage.tsx
subgraph MainPageMessage.tsx
    direction TB
    CC[MainPageMessage]
    CC -->|enumerations| CD[EMainPageMessageTypes]
    CC -->|define properties| CE[IMainPageMessageProps]
    CC -->|create state| CF[useState]

    CC -->|render components| CG[MainPageMessageRow]
end
```

#### UIStrings Module

```mermaid
graph TD

%% UIStrings Module
subgraph UIStrings.ts
    direction TB
    CH[UIStrings]
    CH -->|Enumerate| CI[EUIStrings]
    CH -->|define questions| CJ[initialQuestions]
end
```

This extended set of diagrams should give any new developers a comprehensive understanding of the various components, pipelines, and their interactions within the Boxer AI-Powered Chat Application.

%% Generated by Salon from Braid Technologies, 09/03/2025
