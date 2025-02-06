# Waterfall Browser

A React-based web application for navigating and viewing hierarchical data chunks with a clean, responsive interface using Fluent UI components.

## Overview

Waterfall Browser is a modern web application that allows users to browse and navigate through interconnected data chunks. Each chunk can contain a title, summary, URL, and references to related chunks, creating a waterfall-like navigation experience.

## Technical Stack

- **React**: Frontend framework
- **Fluent UI**: Microsoft's design system for UI components
- **TypeScript**: For type-safe development
- **Web Vitals**: Performance monitoring

## Key Components

### Core Components

- **App**: Main application component handling routing and layout
- **ChunkRetriever**: Manages the data fetching logic and state
- **ChunkView**: Displays individual chunk data with navigation options
- **ChunkViewLoading**: Loading state component
- **ChunkViewError**: Error state component

### Features

- Responsive layout with fluid design
- Parent-child chunk navigation
- Related chunks cross-referencing
- Base64 decoding for secure API key handling
- Performance monitoring with Web Vitals
- Internationalization support through UIString module

## Project Structure
src/
├── App.tsx # Main application component
├── ChunkRetriever.tsx # Data fetching component
├── ChunkView.tsx # Chunk display component
├── ChunkViewError.tsx # Error state component
├── ChunkViewLoading.tsx # Loading state component
├── Defusc.tsx # Base64 decoding utility
├── reportWebVitals.ts # Performance monitoring
└── UIString.ts # UI text constants

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## URL Parameters

The application accepts a `chunkId` parameter in the URL to display specific chunks of data.

Example: `http://your-app-url/?chunk=example-chunk-id`

## Performance Monitoring

The application includes Web Vitals monitoring for key metrics:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

## Internationalization

UI strings are centralized in the `UIString.ts` module for easy maintenance and future internationalization support.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

[Add your license information here]
