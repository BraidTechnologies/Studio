```mermaid
C4Context
title Waterfall Browser System Context

%% Defining the user
Person(user, "User")

%% Defining the web application container
Container(webApp, "Waterfall Browser", "React Web Application", "Allows users to browse and navigate through interconnected data chunks")

%% Grouping components within the web application container
Container_Boundary(webApp_boundary, "Waterfall Browser Components") {
  Component(app, "App", "Main application component handling routing and layout")
  Component(chunkRetriever, "ChunkRetriever", "Manages data fetching logic and state")
  Component(chunkView, "ChunkView", "Displays chunk data with navigation options")
  Component(chunkViewLoading, "ChunkViewLoading", "Loading state component")
  Component(chunkViewError, "ChunkViewError", "Error state component")
  Component(reportWebVitals, "reportWebVitals", "Performance monitoring with Web Vitals")
  Component(uiString, "UIString", "UI text constants for internationalization support")
  Component(defusc, "Defusc", "Base64 decoding utility for secure API key handling")
}

%% Relationships and interactions
Rel(user, webApp, "Navigates and views data chunks using")
Rel(webApp, chunkRetriever, "Fetches and manages data for")
Rel(chunkRetriever, chunkView, "Displays data or state using")
Rel(chunkRetriever, chunkViewLoading, "Shows loading state using")
Rel(chunkRetriever, chunkViewError, "Shows error state using")
Rel(webApp, reportWebVitals, "Monitors performance using")
Rel(webApp, uiString, "Uses UI text constants from")
Rel(chunkRetriever, defusc, "Decodes API key using")

%% Interaction between components
UpdateRel(chunkRetriever, chunkView, "Manages state for")
UpdateRel(chunkRetriever, chunkViewLoading, "Manages state for")
UpdateRel(chunkRetriever, chunkViewError, "Manages state for")
```