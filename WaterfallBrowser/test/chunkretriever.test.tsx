'use strict';
// Copyright Braid technologies ltd, 2024

import { describe, it } from 'mocha';
import { expect } from "expect";
import React from "react";
import { render, screen } from "@testing-library/react";

import { ChunkRetriever } from '../src/ChunkRetriever';
import { testChunkRetriever, parentKey } from './ChunkTestHelpers';

function waitFor(seconds: number): Promise<void> {
   return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// https://medium.com/@ufukbakan/testing-react-with-mocha-and-typescript-ultimate-guide-54332de7cf36#:~:text=Open%20package.json%20with%20any%20text%20editor%2C%20find%20the,can%20use%20this%20glob%20matcher%3A%20.%2F%2A%2A%2F%2A.test.%20%5Bjt%5Ds%3F%20%28x%29

describe("ChunkRetriever", function () {

   it("Renders sample Chunk", async function () {

      async function renderfn () { render(<ChunkRetriever chunkId={parentKey} retrieverFn={testChunkRetriever} />); }

      await renderfn();

      await waitFor(19);

      const summaryLinkElement = screen.getByText(/Summary/i);
      expect(summaryLinkElement !== null).toEqual(true);
    
      const titleLinkElement = screen.getByText(/Title/i);
      expect(titleLinkElement !== null).toEqual(true);  
    
      const linkElement = screen.getByText(/microsoft/i);
      expect(linkElement !== null).toEqual(true);  
   }).timeout(20000);
  
}).timeout(20000);

