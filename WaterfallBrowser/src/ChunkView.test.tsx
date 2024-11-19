import React from 'react';
import { render, screen } from '@testing-library/react';
import ChunkView from './ChunkView';
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';

export function randomInt(min : number, max: number) : number {
   return Math.floor(Math.random() * (max - min)) + min;
}

export function randomKey () : string {
   return randomInt (0, 1000000000).toString();
}

test('renders Chunk in text', () => {

   let now = new Date().toUTCString();

   let record: IStoredChunk = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: "1",
      created: now,
      amended: now,
      contextId: "madeupId",
      userId: "madeupId",
      className: "madeUpClass",
      functionalSearchKey: "1234",
      parentChunkId: undefined,
      originalText: undefined,
      url: "https://micrsoft.com",
      storedEmbedding: undefined,
      storedSummary: {modelId: randomKey(), text: "Summary Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
      storedTitle: {modelId: randomKey(), text: "Title"},
      relatedChunks: undefined
  }

  render(<ChunkView chunk={record}/>);

  const summaryLinkElement = screen.getByText(/Summary/i);
  expect(summaryLinkElement).toBeInTheDocument();

  const titleLinkElement = screen.getByText(/Title/i);
  expect(titleLinkElement).toBeInTheDocument();  

  const linkElement = screen.getByText(/microsoft/i);
  expect(linkElement).toBeInTheDocument();   
});
