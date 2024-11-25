import React from 'react';
import { render, screen } from '@testing-library/react';
import ChunkView from './ChunkView';
import { testChunk } from './ChunkTestHelpers';

// Simple set of tests - just check we can pick up a few fields from the DOM
test('renders Chunk in text', () => {
  
  render(<ChunkView chunk={testChunk}/>);

  const summaryLinkElement = screen.getByText(/Summary/i);
  expect(summaryLinkElement).toBeInTheDocument();

  const titleLinkElement = screen.getByText(/Title/i);
  expect(titleLinkElement).toBeInTheDocument();  

  const linkElement = screen.getByText(/microsoft/i);
  expect(linkElement).toBeInTheDocument();   
});
