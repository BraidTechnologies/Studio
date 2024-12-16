
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';



export let parentKey = "123";
let childKey1 = "456";
let childKey2 = "789";
let modelKey = "TestModel";

let now = new Date().toUTCString();

export let testChunk: IStoredChunk = {
   id: parentKey,
   applicationId: "Test",
   schemaVersion: "1",
   created: now,
   amended: now,
   contextId: "madeupId",
   userId: "madeupId",
   className: "madeUpClass",
   functionalSearchKey: parentKey,
   parentChunkId: undefined,
   originalText: undefined,
   url: "https://microsoft.com",
   storedEmbedding: undefined,
   storedSummary: {modelId: modelKey, text: "Summary Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
   storedTitle: {modelId: modelKey, text: "Title"},
   relatedChunks: [childKey1, childKey2]
}

export let childChunk1: IStoredChunk = {
   id: childKey1,
   applicationId: "Test",
   schemaVersion: "1",
   created: now,
   amended: now,
   contextId: "madeupId",
   userId: "madeupId",
   className: "madeUpClass",
   functionalSearchKey: childKey1,
   parentChunkId: parentKey,
   originalText: undefined,
   url: "https://microsoft.com",
   storedEmbedding: undefined,
   storedSummary: {modelId: modelKey, text: "Summary Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
   storedTitle: {modelId: modelKey, text: "Title"},
   relatedChunks: undefined
}

export let childChunk2: IStoredChunk = {
   id: childKey1,
   applicationId: "Test",
   schemaVersion: "1",
   created: now,
   amended: now,
   contextId: "madeupId",
   userId: "madeupId",
   className: "madeUpClass",
   functionalSearchKey: childKey2,
   parentChunkId: parentKey,
   originalText: undefined,
   url: "https://microsoft.com",
   storedEmbedding: undefined,
   storedSummary: {modelId: modelKey, text: "Summary Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
   storedTitle: {modelId: modelKey, text: "Title"},
   relatedChunks: undefined
}

export let parentChunk = testChunk;


export async function testChunkRetriever (chunkId: string | undefined) : Promise <IStoredChunk | undefined> {

   switch (chunkId) {
      case parentKey:
         return parentChunk;
      case childKey1:
         return childChunk1;        
      case childKey2:
         return childChunk2;            
      default:
         return undefined;
   }
}

