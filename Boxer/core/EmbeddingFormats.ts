// Copyright (c) 2024 Braid Technologies Ltd

export interface FullEmbedding {
   speaker: string;
   title: string;
   sourceId: string;
   hitTrackingId: string;
   description: string;
   start: string;
   seconds: number;
   text: string;
   summary: string;
   ada_v2: Array<number>;
};

export interface LiteEmbedding {
   url: string;
   summary: string;
   ada_v2: Array<number>;
};

export type MakeEmbeddingUrlFnLite = (a: LiteEmbedding) => string;
export type MakeEmbeddingUrlFnFull = (a: FullEmbedding) => string;

function makeYouTubeUrl (sourceId: string, startHms: string, seconds: number) : string {

   let a = startHms.split(':'); // split it at the colons

   let h =  a[0], m = a[1], s = a[2];

   return 'https://www.youtube.com/watch?v=' + sourceId + '&t=' + h + 'h' + m + 'm' + s +'s';
} 

function makeGithubUrl (sourceId: string) : string {

   return 'https://github.com/' + sourceId;
} 

function makeWebUrl (sourceId: string) : string {

   return 'https://' + sourceId;
} 

export function makeYouTubeUrlFromFullEmbedding (embedding: FullEmbedding) : string {
   return makeYouTubeUrl (embedding.sourceId, embedding.start, embedding.seconds);        
}

export function  makeGithubUrlFromFullEmbedding (embedding: FullEmbedding) : string {
   return makeGithubUrl (embedding.sourceId);        
}

export function makeHtmlUrlfromFullEmbedding (embedding: FullEmbedding) : string {
   return makeWebUrl (embedding.sourceId);        
}