```mermaid
graph LR
subgraph Boxed
        Core
                ActivityRepository
                Services
                        AIConnection
                        BraidFluidConnection
                        KeyRetriever
                Utilities
                        CaucusFramework
                        Data Models
                        Debounce
                        NotificationFramework
                        StreamingFramework
                        Utilities
        React Components
                AnimatedIconButton
                ConversationPane
                ConversationController
                JoinPane
                Supporting Components
                        MessagePrompt
                        MainPageMessage
                        ConversationMessagePrompt
end
subgraph Outside Box
        Configuration
                ConfigStrings
                IAdminRepository
                IKeyGenerator
        Validation
                JoinPageValidator
        Logging
                Logging
        Media
                Media
        Shared Environment
                Errors
                FluidConnection
                        BraidFluidConnection
                IKeyGeneratorFactory
                JoinDetails
        Testing
                Asserts
                Queue
                Utilities
        Other
                Icons
                Keys
                Message
                NotificationFramework
                Persona
                SharedEmbedding
                StreamingFramework
                Utilities
                UuidKeyGenerator
end
subgraph AI
        LMs
                AIConnection
end
subgraph User
        Messaging
                Message
                Persona
                MessagePrompt
                ConversationController
                ConversationMessagePrompt
                ConversationPane
                JoinPane
end
subgraph Messaging Services
        Fluid Connection
                BraidFluidConnection
        Braid Repository
                IActivityRepository
        Key Generation
                IKeyGenerator
                UuidKeyGenerator
end

subgraph Utilities
        Notifications
                NotificationFramework
        Clock
                Debounce
        Collections
                CaucusFramework
        Streaming
                StreamingFramework
        Miscellaneous
                Asserts
                Utilities
end

subgraph Configuration
        Environment
                ConfigStrings
        Administration
                IAdminRepository
        API Keys
                IKeyGenerator
                IKeyGeneratorFactory
end

subgraph Testing
        Asserts
        Utilities
end

subgraph Other
        Icons
        Keys
        SharedEmbedding
end
```