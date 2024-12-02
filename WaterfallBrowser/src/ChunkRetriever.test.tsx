import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChunkRetriever } from './ChunkRetriever';
import { parentKey, testChunkRetriever } from './ChunkTestHelpers';
import { act } from 'react';

// Simple set of tests - just check we can pick up a few fields from the DOM
test('renders Chunk in text', async () => {

   await act( async () => render(<ChunkRetriever chunkId={parentKey} retrieverFn={testChunkRetriever} />));

   await new Promise(process.nextTick);

   const summaryLinkElement = screen.getByText(/Summary/i);
   expect(summaryLinkElement).toBeInTheDocument();

   const titleLinkElement = screen.getByText(/Title/i);
   expect(titleLinkElement).toBeInTheDocument();

   const linkElement = screen.getByText(/microsoft/i);
   expect(linkElement).toBeInTheDocument();
});
