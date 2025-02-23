```mermaid
C4Container
%% Containers - AI-Powered Chat Application %%

%% The System Context %%
System_Boundary(Boxer) {
  Container(BoxerSystem, "Boxer", "Real-time Chat Application")

  Container_Boundary(CoreBoundary, "Core") {
    Container(Message, "Message", "TypeScript", "Represents chat messages with support for streaming")
    Container(Persona, "Persona", "TypeScript", "User profile management")
    Container(SharedEmbedding, "SharedEmbedding", "TypeScript", "Handles shared embedded content")
    Container(Like, "Like", "TypeScript", "Manages user reactions")
    Container(AIConnection, "AIConnection", "TypeScript", "Manages interactions with the LLM")
    Container(BraidFluidConnection, "BraidFluidConnection", "TypeScript", "Handles real-time collaboration")
    Container(ActivityRepository, "ActivityRepository", "TypeScript", "Stores user activities and message history")
    Container(KeyRetriever, "KeyRetriever", "TypeScript", "Manages API key authentication")
    Container(CaucusFramework, "CaucusFramework", "TypeScript", "Framework for managing dynamic collections")
    Container(NotificationFramework, "NotificationFramework", "TypeScript", "Observer pattern implementation")
    Container(StreamingFramework, "StreamingFramework", "TypeScript", "Handles data streaming")
    Container(Debounce, "Debounce", "TypeScript", "Rate limiting utility")
  }
  
  Container_Boundary(UIBoundary, "UI") {
    Container(AnimatedIconButton, "AnimatedIconButton", "React/TypeScript", "Animated UI elements")
    Container(ConversationPane, "ConversationPane", "React/TypeScript", "Main chat interface")
    Container(ConversationController, "ConversationController", "React/TypeScript", "Chat logic controller")
    Container(JoinPane, "JoinPane", "React/TypeScript", "Session joining interface")
    Container(MessagePrompt, "MessagePrompt", "React/TypeScript", "Message input interface")
    Container(MainPageMessage, "MainPageMessage", "React/TypeScript", "Status message display")
    Container(ConversationMessagePrompt, "ConversationMessagePrompt", "React/TypeScript", "Enhanced message input")
  }
  
  Container_Boundary(TestBoundary, "Test") {
    Container(TestSuite, "TestSuite", "TypeScript", "Comprehensive test suite using Mocha")
  }
}

Rel(AnimatedIconButton, ConversationPane, "Enhances UI with animation")
Rel(ConversationController, AIConnection, "Processes AI-generated responses")
Rel(UIBoundary, CoreBoundary, "Interactions trigger updates and state changes via controllers")

Rel(NotificationFramework, ConversationPane, "Notifies UI components regarding state updates")
Rel(ActivityRepository, BraidFluidConnection, "Stores and retrieves messages")
Rel(ActivityRepository, Message, "Saves chat messages")
Rel(Message, StreamingFramework, "Allows chat messages to be streamed")
```