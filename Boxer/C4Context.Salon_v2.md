```mermaid
graph TD
  subgraph User
    User
  end
  subgraph App
    AnimatedIconButton
    ConversationPane
    ConversationController
    JoinPane
    MainPageMessage
    AppEntry
    ColumnStyles
    ConversationMessagePrompt
    MessagePrompt
    SingleMessageView
    JoinDetails
    JoinPageValidator
    ConversationView
    InputView
    KeyRetriever
    ActivityRepository
    KeyGenerator
    SessionKey
    ConversationKey
    ActivityRepositoryCosmos
    Configuration
    Utilities
    Queue
  end
  subgraph BrainConnection
    BraidFluidConnection
  end

  subgraph State Management
    NotificationFramework
    Notification
    ObserverInterest
    NotificationRouter
    NotificationRouterFor
    Notifier
  end

  subgraph ML
    ApiCalls
  end

  subgraph LLMs
    AIConnection
    KeyRetriever
  end
  subgraph DataRep
    ActivityRepositoryApi
  end
  subgraph Data Models
    ActivityRecord
    Message
    Persona
    SharedEmbedding
    Like
  end
```