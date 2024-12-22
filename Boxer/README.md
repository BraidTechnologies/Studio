# Boxer - AI-Powered Chat Application

## Overview
Boxer is a real-time chat application that integrates AI capabilities using Large Language Models (LLMs). The application is built with TypeScript/React and uses the Fluid Framework for real-time collaboration.

## Project Structure

├── core/           # Core business logic and utilities
├── ui/             # UI components and styles
├── test/           # Test cases and utilities


### Core Components

#### Data Models
- `Message.ts` - Represents chat messages with support for streaming
- `Persona.ts` - User profile management
- `SharedEmbedding.ts` - Handles shared embedded content
- `Like.ts` - Manages user reactions

#### Services
- `AIConnection.ts` - Manages interactions with the LLM
- `BraidFluidConnection.ts` - Handles real-time collaboration
- `ActivityRepository.ts` - Stores user activities and message history
- `KeyRetriever.ts` - Manages API key authentication

#### Utilities
- `CaucusFramework.ts` - Framework for managing dynamic collections
- `NotificationFramework.ts` - Observer pattern implementation
- `StreamingFramework.ts` - Handles data streaming
- `Debounce.ts` - Rate limiting utility

### UI Components

#### Main Components
- `AnimatedIconButton.tsx` - Animated UI elements
- `ConversationPane.tsx` - Main chat interface
- `ConversationController.tsx` - Chat logic controller
- `JoinPane.tsx` - Session joining interface

#### Supporting Components
- `MessagePrompt.tsx` - Message input interface
- `MainPageMessage.tsx` - Status message display
- `ConversationMessagePrompt.tsx` - Enhanced message input

## Key Features
1. Real-time chat with AI integration
2. Collaborative document sharing
3. Message reactions and likes
4. User presence tracking
5. Embedded content support
6. Session management
7. Activity tracking

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- TypeScript
- React

### Installation
1. Clone the repository
2. Install dependencies:


## Architecture

### Data Flow
1. User actions trigger UI components
2. Controllers process actions and update state
3. Fluid Framework syncs changes across clients
4. Activity Repository persists relevant data
5. AI Connection processes LLM requests

### State Management
- Uses React hooks for local state
- Fluid Framework for shared state
- Notification system for cross-component communication

### Testing
- Comprehensive test suite using Mocha
- Unit tests for core functionality
- Integration tests for key features

## Best Practices
1. Use TypeScript for type safety
2. Follow the notification pattern for state updates
3. Implement error handling using custom error classes
4. Use debouncing for performance optimization
5. Write tests for new features

## Common Tasks

### Adding a New Feature
1. Create necessary data models in `/core`
2. Implement business logic
3. Create UI components in `/ui`
4. Add tests in `/test`
5. Update documentation

### Debugging
- Check browser console for errors
- Use the notification system for tracking state changes
- Review activity repository for historical data
- Check AI connection logs for LLM interactions

## Contributing
1. Create a feature branch
2. Write tests for new functionality
3. Update documentation
4. Submit a pull request

## Support
For questions or issues, please refer to:
1. Code documentation
2. Test cases for implementation examples
3. Core utility functions for common operations
