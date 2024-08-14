'use strict';
// Copyright Braid Technologies ltd, 2024
import { SessionKey } from '../core/Keys';
import { Embedding, EmbeddingMatchAccumulator, lookLikeSameSource} from '../core/Embedding';
import { kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount} from '../core/IEmbeddingRepository';
import { expect } from 'expect';
import { describe, it } from 'mocha';
import { throwIfUndefined } from '../core/Asserts';
import { getEmbeddingRepository } from '../core/IEmbeddingRepositoryFactory';

var myUrl: string = "1234";
var mySummary: string = "Jon";
var myAda = new Array<number> ();
var myTimeStamp = new Date();
var myRelevance = 0.5;

var someoneElsesUrl: string = "5678";
var someoneElsesSummary: string = "Barry";
var someoneElseAda = new Array<number> ();
var someoneElsesTimeStamp = new Date(0);
var someoneElsesRelevance = 0.0;

describe("KnowledgeSource", function () {

   var ks1: Embedding, ks2: Embedding, ksErr:Embedding;

   ks1 = new Embedding(myUrl, mySummary, myAda, myTimeStamp, myRelevance);

   ks2 = new Embedding(someoneElsesUrl, someoneElsesSummary, someoneElseAda, someoneElsesTimeStamp, someoneElsesRelevance);

   it("Needs to construct an empty object", function () {

      var ksEmpty = new Embedding();

      expect(ksEmpty.summary).toEqual("");     
   });

   it("Needs to compare for equality and inequality", function () {

      var ksNew: Embedding = new Embedding(ks1.url, ks1.summary, ks1.ada_v2, ks1.timeStamp, ks1.relevance);

      expect(ks1.equals(ks1)).toEqual(true);
      expect(ks1.equals(ksNew)).toEqual(true);
      expect(ks1.equals(ks2)).toEqual(false);
   });
   
   
   it("Needs to detect inequality on date", function () {

      var ksNew: Embedding = new Embedding(ks1.url, ks1.summary, ks1.ada_v2, new Date(), ks1.relevance);

      expect(ks1.equals(ksNew)).toEqual(false);
   });

   it("Needs to correctly store attributes", function () {
         
      expect(ks1.summary === mySummary).toEqual(true);
      throwIfUndefined (ks1.timeStamp);
      expect(ks1.timeStamp.getTime() === myTimeStamp.getTime()).toEqual(true);
   });

   it("Needs to copy construct", function () {

      let ks2: Embedding = new Embedding(ks1);

      expect(ks1.equals(ks2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      var ksNew: Embedding = new Embedding(ks1.url, ks1.summary, ks1.ada_v2, ks1.timeStamp, ks1.relevance);

      ksNew.url = someoneElsesUrl;
      ksNew.summary = someoneElsesSummary;
      ksNew.ada_v2 = someoneElseAda;
      ksNew.timeStamp = someoneElsesTimeStamp;
      ksNew.relevance = someoneElsesRelevance;
     
      expect(ks2.equals (ksNew)).toEqual(true);
   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = ks1.streamOut();

      var ksNew: Embedding = new Embedding(ks1.url, ks1.summary, ks1.ada_v2, ks1.timeStamp, ks1.relevance);
      ksNew.streamIn(stream);
    
      expect(ks1.equals(ksNew)).toEqual(true);
   });

});

describe("EmbeddingMatchAccumulator", function () {

   it("Needs to construct an empty object", function () {

      let ksEmpty = new EmbeddingMatchAccumulator(kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount);

      expect(ksEmpty.chunks.length).toEqual(0);     
   });

   it("Needs to compare for equality and inequality", function () {

      let ksEmpty = new EmbeddingMatchAccumulator(kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount);      
      let matchesNew = new EmbeddingMatchAccumulator(-1, 3);        

      expect(ksEmpty.equals(ksEmpty)).toEqual(true);     
      expect(ksEmpty.equals(matchesNew)).toEqual(false);
   });

   it("Needs to correctly store attributes", function () {
         
      let ksEmpty = new EmbeddingMatchAccumulator(kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount);          
      expect(ksEmpty.similarityThreshold === kDefaultMinimumCosineSimilarity).toEqual(true);
      expect(ksEmpty.howMany === kDefaultSearchChunkCount).toEqual(true);
   });
});


describe("KnowledgeSource URLs", function () {

   it("Needs to identify URLs from same YouTube video", function () {

      var url1 = "https://www.youtube.com/watch?v=roEKOzxilq4&t=00h00m00s";
      var url2 = "https://www.youtube.com/watch?v=roEKOzxilq4&t=00h05m00s";

      expect(lookLikeSameSource (url1, url2)).toEqual(true);     
   });

   it("Needs to identify URLs from different YouTube videos", function () {

      var url1 = "https://www.youtube.com/watch?v=roEKOzxilq4&t=00h00m00s";
      var url2 = "https://www.youtube.com/watch?v=xoEKOzailq4&t=00h00m00s";

      expect(lookLikeSameSource (url1, url2)).toEqual(false);        
   });

   it("Needs to identify URLs from same GitHub repo", function () {

      var url1 = "https://github.com/jonverrier/BraidEng";
      var url2 = "https://github.com/jonverrier/BraidEng/issues";

      expect(lookLikeSameSource (url1, url2)).toEqual(true);     
   });

   it("Needs to identify URLs from different GitHub repos", function () {

      var url1 = "https://github.com/jonverrier/BraidEng";
      var url2 = "https://github.com/jonverrier/BraidWeb";

      expect(lookLikeSameSource (url1, url2)).toEqual(false);        
   });

   describe("KnowledgeRepository", function () {

      let repository = getEmbeddingRepository (new SessionKey (""));

      it("Needs to identify related content given an input URL", async function () {
   
         let message = await repository.lookForRelatedContent ("https://www.youtube.com/watch?v=roEKOzxilq4&t=00h00m00s", "test");
   
         expect(typeof message === 'undefined').toEqual(false);     
      });
   
      it("Needs to identify starter content", async function () {

         let message = await repository.lookForRelatedContent (undefined, "test");         
   
         expect(typeof message === 'undefined').toEqual(false);       
      });
   
   });

});