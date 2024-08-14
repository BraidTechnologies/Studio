// Copyright (c) 2024 Braid Technologies Ltd
 
import { MStreamable } from "./StreamingFramework";
import { areSameDate, areSameShallowArray, areSameDeepArray} from './Utilities';
import { InvalidParameterError } from "./Errors";

function copyTimeStamp (stamp: Date | undefined) : Date | undefined {
   return (typeof stamp === 'undefined') ? undefined : new Date(stamp);
}

function copyRelevance (relevance: number | undefined) : number | undefined {
   return (typeof relevance === 'undefined') ? undefined : relevance;
}

const youTubeHostname = "www.youtube.com";
const gitHubHostname = "github.com";

export function lookLikeSameSource (url1: string, url2: string ) : boolean {

   const URLLeft = new URL (url1);
   const URLRight = new URL (url2);

   // Youtube format URL
   // https://www.youtube.com/watch?v=l5mG4z343qg&t=00h00m00s
   // To compare two YouTube URLs we look at the ?v= parameter for the video ID
   if (URLLeft.hostname === (youTubeHostname) && URLRight.hostname === (youTubeHostname)) {
      const videoLeft = URLLeft.searchParams.get('v');
      const videoRight = URLRight.searchParams.get('v');  
      
      if (videoLeft === videoRight)
         return true;
      else
         return false;

   }

   // GitHub format URL
   // https://github.com/organisation/repo/...
   // To compare two GitHub URLs we look at the first two path paramters   
   const pathLeft = URLLeft.pathname.split('/').slice (1);
   const pathRight = URLRight.pathname.split('/').slice(1);

   if (URLLeft.hostname === (gitHubHostname) && URLRight.hostname === (gitHubHostname) 
      && (pathLeft.length >= 2) && (pathRight.length >= 2)) {

      if (pathLeft[0] === pathRight[0] && pathLeft[1] === pathRight[1])
         return true;
      else
         return false;
   }

   // To compare two Web URLs we look at the first path paramters  
   if ((URLLeft.hostname === URLRight.hostname) && 
       (pathLeft.length >= 1) && (pathRight.length >= 1)) {

         if (pathLeft[0] === pathRight[0])
            return true;
         else
            return false;
   }

   return false;
}

/**
 * Embeddeding object
 * @param url - link to source on the web.
 * @param summary - text summary (50 words)
 * @param ada_v2: embedding value array. Note this is copied by value to avoid duplicating large arrays.
 * @param timeStamp - when the item is dated from - can be undefined if not known
 * @param relevance - cosine relevance score to a query - can be undefined if the source reference has not been compared yet
 */
export class Embedding extends MStreamable {
   private _url: string;
   private _summary: string;
   private _ada_v2: Array<number>;
   private _timeStamp: Date | undefined;   
   private _relevance: number | undefined;

   /**
    * Create an empty Embeddeding object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a Embedding object
    * @param url_ - link to source on the web.
    * @param summary_ - text summary (50 words)
    * @param ada_v2_: embedding value array. Note this is copied by value to avoid duplicating large arrays.
    * @param timeStamp_ - when the item is dated from - can be undefined if not known
    * @param relevance_ - cosine relevance score to a query - can be undefined if the source reference has not been compared yet
    */
   public constructor(url_: string, summary_: string, ada_v2_: Array<number>, 
                      timeStamp_: Date | undefined, relevance_: number | undefined);

   /**
    * Create a Embedding object
    * @param source - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(source: Embedding);

   public constructor(...arr: any[])
   {

      super();

      if (arr.length === 0) {
         this._url = ""; 
         this._summary = "";     
         this._ada_v2 = new Array<number> ();                  
         this._timeStamp = undefined;
         this._relevance = undefined;         
         return;
      }

      var localUrl: string;
      var localSummary: string;
      var localAda: Array<number>;
      var localTimeStamp: Date | undefined;      
      var localRelevance: number | undefined;

      if (arr.length === 1) {
         localUrl = arr[0]._url
         localSummary = arr[0]._summary;
         localAda = arr[0]._ada_v2;
         localTimeStamp = copyTimeStamp (arr[0]._timeStamp);
         localRelevance = copyRelevance (arr[0]._relevance);         
      }
      else { 
         localUrl = arr[0];
         localSummary = arr[1]; 
         localAda = arr[2];              
         localTimeStamp = copyTimeStamp (arr[3]);
         localRelevance = copyRelevance (arr[4]);           
      }

      this._url = localUrl;
      this._summary = localSummary;
      this._ada_v2 = localAda;
      this._timeStamp = localTimeStamp;      
      this._relevance = localRelevance;
   }

   streamOut(): string {

      return JSON.stringify({ url: this._url, summary: this._summary, ada_v2: this._ada_v2, timeStamp: this._timeStamp, relevance: this._relevance});
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new Embedding (obj.url, obj.summary, obj.ada_v2, obj.timeStamp, obj.relevance));   
   }

   /**
   * set of 'getters' for private variables
   */
   get url(): string {
      return this._url;
   }
   get summary(): string {
      return this._summary;
   }
   get ada_v2(): Array<number> {
      return this._ada_v2;
   }   
   get timeStamp(): Date | undefined {
      return this._timeStamp;
   }
   get relevance(): number | undefined {
      return this._relevance;
   }

   /**
   * set of 'setters' for private variables
   */
   set url(url_: string) {

      this._url = url_;
   }

   set summary(summary_: string) {

      this._summary = summary_;
   }

   set ada_v2(ada_v2_: Array<number>) {

      this._ada_v2 = ada_v2_;
   }   

   set timeStamp(timeStamp_: Date) {

      this._timeStamp = timeStamp_;
   }

   set relevance (relevance_: number) {

      this._relevance = relevance_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Embedding): boolean {

      return ((this._url === rhs._url) &&
         (this._summary === rhs._summary) &&
         (areSameShallowArray (this._ada_v2, rhs._ada_v2)) &&         
         (areSameDate (this._timeStamp, rhs._timeStamp)) &&         
         ((this._relevance === undefined && rhs._relevance === undefined) || (this._relevance === rhs._relevance)));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Embedding): Embedding {

      this._url = rhs._url;
      this._summary = rhs._summary;
      this._ada_v2 = rhs._ada_v2;
      this._timeStamp = copyTimeStamp (rhs._timeStamp);      
      this._relevance = copyRelevance (rhs._relevance);

      return this;
   }
}

/**
 * EmbeddingMatchAccumulator object
 * @param similarityThresholdLo_: Lowest cosine similarity to allow
 * @param howMany_: how many segments to collect
 * Conceptually this class acts a 'bag' - keeps the top N sources in an unordererd array, only sorts them when requested at the end,
 * which avoids lots of re-sorting while searching for the top N. Should be OK performance wise as the loest value will climb up quite quickly. 
 */
export class EmbeddingMatchAccumulator {

   private _chunks: Array<Embedding>;
   private _similarityThresholdLo: number;
   private _howMany : number;

   /**
    * Create a EmbeddingMatchAccumulator object
    * @param similarityThresholdLo_ - lowest bar for similarity
    * @param howMany_ - how many items to retrieve 
    */
   public constructor(similarityThresholdLo_: number, howMany_: number) {

      if (similarityThresholdLo_ < -1 || similarityThresholdLo_ > 1)
         throw new InvalidParameterError ("Cosine similarity must be between -1 and 1.");

      this._chunks = new Array<Embedding> ();  
      this._similarityThresholdLo = similarityThresholdLo_;
      this._howMany = howMany_;            
   }

   /**
   * set of 'getters' for private variables
   */
   get similarityThreshold (): number {
      return this._similarityThresholdLo;
   }   
   get howMany (): number {
      return this._howMany;
   }        
   get chunks (): Array<Embedding> {
      this._chunks.sort ((a: Embedding, b: Embedding) : number => {
          if (!a.relevance || !b.relevance)
             return 0;
          return b.relevance - a.relevance;
      });
      return this._chunks;
   }   

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: EmbeddingMatchAccumulator): boolean {

      return (this._howMany == rhs._howMany 
         && this._similarityThresholdLo == rhs._similarityThresholdLo 
         && areSameDeepArray (this._chunks, rhs._chunks));
   }

   /**
    * searches current most relevant results to see if the new one should be included.  
    * @param urlIn - the URL of a reference source, may be undefined. If it is defined, we are looking for similar atcitcles. 
    */
   private lowestOfCurrent (urlIn: string | undefined): number {

      if (this._chunks.length === 0)
         return -1;

      let lowestRelevance = this._chunks[0].relevance;
      let lowestIndex = 0;
      let sameSource = false;
      let sameIndex = -1;

      if (urlIn) {
         for (let i = 1; i < this._chunks.length; i++) {
            if (lookLikeSameSource (urlIn, this._chunks[i].url)) {
               sameSource = true;
               sameIndex = i;
            }
         }
      }

      if (sameSource) {
         // If we have an entry from the same source, replace if the new one looks better
         let comp = this._chunks[sameIndex].relevance;

         if (typeof comp !== 'undefined' && typeof lowestRelevance !== 'undefined') {
          
            let current = this._chunks[sameIndex].relevance;

            if ((typeof comp !== 'undefined' && typeof current !== 'undefined') 
               && (comp < current )) {
               lowestIndex = sameIndex;
            }
         }
      }
      else {
         // Else replace the lowest relevance entry
         for (let i = 1; i < this._chunks.length; i++) {

            let comp = this._chunks[i].relevance;

            if (typeof comp !== 'undefined' && typeof lowestRelevance !== 'undefined') {
          
               if (comp < lowestRelevance) {
                  lowestRelevance = comp;
                  lowestIndex = i;
               }
            }
         }
      }

      return lowestIndex;
   }   

   /**
    * searches current most relevant results to see if the new one should be included.  
    * @param candidate - the object to test  
    * @param url - optionally, the URL of the source we started with. Use this to avoid picking duplicates. 
    */
   replaceIfBeatsCurrent (candidate: Embedding, urlIn: string | undefined): boolean {

      // If we have a reference source, check if its just the same source as our reference e.g. different chunk of a Youtube video
      // If it is, we bail 
      if (urlIn && lookLikeSameSource (candidate.url, urlIn)) {
         return false;
      }

      // Now check we are not piling up multiple references to the same source
      // If it is, we bail 
      for (let i = 0; i < this._chunks.length; i++) {
         if (lookLikeSameSource (candidate.url, this._chunks[i].url))
            return false;         
      }
            
      // If the array can grow we just add the new candidate
      if (this._chunks.length < this._howMany) {
         if (typeof candidate.relevance !== 'undefined' && candidate.relevance >= this._similarityThresholdLo) {
            this._chunks.push (candidate);
         }
         return true;
      }

      // Else we do a search and insert the new one if it is better than a current candidate
      let lowestIndex = this.lowestOfCurrent(candidate.url);
      let currentLowest = this._chunks[lowestIndex];

      if (typeof currentLowest.relevance !== 'undefined' 
      && typeof candidate.relevance !== 'undefined') {
         if (currentLowest.relevance < candidate.relevance && candidate.relevance >= this._similarityThresholdLo) {
            this._chunks[lowestIndex] = candidate;
            return true;
         }
      }

      return false;
   }    
}