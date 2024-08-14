// Copyright (c) 2024 Braid Technologies Ltd
 
import { IEmbeddingRepository, kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount } from "./IEmbeddingRepository";
import { Embedding, EmbeddingMatchAccumulator } from "./Embedding";
import { LiteEmbedding } from "./EmbeddingFormats";
import { Message } from "./Message";
import { EConfigStrings, EConfigNumbers } from "./ConfigStrings";
import { Environment, EEnvironment } from "./Environment";
import { ConnectionError } from "./Errors";
import { logApiInfo } from "./Logging";

let embeddings = new Array<LiteEmbedding> ();

/**
 * Calculates the cosine similarity between two vectors.
 * @param vector1 The first vector.
 * @param vector2 The second vector.
 * @returns The cosine similarity score.
 */
export function cosineSimilarity(vector1: number[], vector2: number[]): number {
   if (vector1.length !== vector2.length) {
       throw new Error("Vector dimensions must match for cosine similarity calculation.");
   }

   const dotProduct = vector1.reduce((acc, val, index) => acc + val * vector2[index], 0);
   const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
   const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));

   if (magnitude1 === 0 || magnitude2 === 0) {
       throw new Error("Magnitude of a vector must be non-zero for cosine similarity calculation.");
   }

   return dotProduct / (magnitude1 * magnitude2);
}

function lookupMostSimilar (repository: Array<LiteEmbedding>, 
   embedding: Array<number>, urlIn: string | undefined, 
   builder: EmbeddingMatchAccumulator): void {

      for (let i = 0; i < repository.length; i++) {

         let url = repository[i].url; 
         let relevance = Number (cosineSimilarity (embedding, repository[i].ada_v2).toPrecision(2));

         let candidate = new Embedding (url, repository[i].summary, repository[i].ada_v2, undefined, relevance);
         let changed = builder.replaceIfBeatsCurrent (candidate, urlIn);
      }         
}

function lookupUrl (repository: Array<LiteEmbedding>, 
   urlIn: string | undefined): Embedding | undefined {

      for (let i = 0; i < repository.length; i++) {

         let url = repository[i].url; 
         if (url === urlIn) {
            let candidate = new Embedding (url, repository[i].summary, repository[i].ada_v2, undefined, undefined);
            return candidate;
         }
      }   

      return undefined;     
}

export class EmbeddingRepositoryFile implements IEmbeddingRepository {

   async lookupMostSimilar (embedding: Array<number>, url: string | undefined, 
      similarityThresholdLo: number, howMany: number) : Promise<EmbeddingMatchAccumulator> {

      await waitforEmbeddedingLoad();

      let chunks = new EmbeddingMatchAccumulator (similarityThresholdLo, howMany);

      lookupMostSimilar (embeddings as Array<LiteEmbedding>, embedding, url, chunks);

      return chunks;
   }   

   /**
    * lookUpSimilarfromUrl 
    * look to see of we have similar content from other sources
    */   
   async lookupSimilarfromUrl (url: string, similarityThresholdLo: number, howMany: number) : Promise<EmbeddingMatchAccumulator> {
      
      await waitforEmbeddedingLoad();

      let chunkIn = lookupUrl (embeddings as Array<LiteEmbedding>, url);

      if (chunkIn) {
         return this.lookupMostSimilar (chunkIn.ada_v2, url, 
                                        similarityThresholdLo, howMany);
      }

      return new EmbeddingMatchAccumulator(similarityThresholdLo, howMany);
   }

   /**
    * lookupUrlSummary 
    * looks for summary given a URL
    */      
   async lookupUrlSummary (url: string) : Promise<string | undefined> {

      await waitforEmbeddedingLoad();

      let chunkIn = lookupUrl (embeddings as Array<LiteEmbedding>, url);

      return chunkIn ? chunkIn.summary : undefined;
   }

   async lookForRelatedContent (url_: string | undefined, messageText: string) : Promise<Message | undefined> {

      let candidateChunk : Embedding | undefined = undefined;
      let haveUrl = true;

      await waitforEmbeddedingLoad();

      // If we do not have a history, provide a helpful start point 
      if (!url_) {
         haveUrl = false;
         url_ = "https://github.com/microsoft/generative-ai-for-beginners/blob/main/01-introduction-to-genai/README.md";         
         candidateChunk = lookupUrl (embeddings as Array<LiteEmbedding>, url_);
      }
      else {
         let finder = await this.lookupSimilarfromUrl (url_, kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount);         
         if (finder.chunks.length > 0)
            candidateChunk = finder.chunks[0];
      }

      if (candidateChunk) {

         let suggested = new Message();
         suggested.authorId = EConfigStrings.kLLMGuid;
         suggested.text = messageText; 
         suggested.sentAt = new Date();

         let chunks = new Array<Embedding> ();         
         chunks.push (candidateChunk);

         suggested.chunks = chunks;

         return suggested;
      }
      
      return undefined;   
   }
}

let haveLoaded: boolean = false;
let started = false;

async function startEmbeddingFileDownload () : Promise<boolean> {
   
   if (started)
      return false;

   started = true;

   let environment = Environment.environment();
   let url = "";

   if (environment === EEnvironment.kLocal) {
      url = EConfigStrings.kEmbeddingFileUrlLocal;
   }
   else {
      url = EConfigStrings.kEmbeddingFileUrlProduction;
   }

   let startTime = new Date();

   const response : Response = await fetch(url, {
      method: "GET", 
      mode: "same-origin",  
      cache: "default",    
      credentials: "same-origin", 
      headers: {
         "Content-Type": "application/json",
      },
      redirect: "follow", 
      referrerPolicy: "no-referrer", 
   });

   response.json().then ((data: any) => {
       embeddings = data;
       haveLoaded = true;
       let endTime = new Date();   
       
       logApiInfo ("Embedding file loadtime: ", endTime.getTime() - startTime.getTime())
       return true;

   }).catch ((err) => {
       throw new ConnectionError (err.toString());      
   })

   // Cant actualy get here but compiler complains
   return started;
}

 async function waitforEmbeddedingLoad () : Promise<boolean> {

   startEmbeddingFileDownload();

   let maxTries = 4 * EConfigNumbers.kMaxDownloadWaitSeconds; // The '4' must move on cencert with the '250' msecs below
                                                              // i.e 4 * 250 msecs = target max delay in seconds
   let done = new Promise<boolean> (function(resolve, reject) {
     
      function inner () {

         maxTries--;

         if (haveLoaded) {
            resolve (true);
            clearInterval(timeoutID);
         }

         if (maxTries === 0) {
            reject();
            clearInterval(timeoutID);               
         }

      }

      let timeoutID = setInterval(inner, 250);     
   });

   return done; 
}

// Get download started on module load
startEmbeddingFileDownload();