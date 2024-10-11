'use strict';
// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { Like } from '../core/Like';

let me = "Jon";
let now = new Date();

let them = "Jon";
let nowThem = new Date("1/1/2024");

describe("Like", async function () {
     

   var l1: Like, l2: Like, lErr:Like;

   l1 = new Like(me, now);

   l2 = new Like(them, nowThem);

   it("Needs to construct an empty object", function () {

      var lEmpty = new Like();

      expect(lEmpty.name).toEqual("");     
   });

   it("Needs to compare for equality and inequality", function () {

      var lNew: Like = new Like(l1.name, l1.when);

      expect(l1.equals(l1)).toEqual(true);
      expect(l1.equals(lNew)).toEqual(true);
      expect(l1.equals(l2)).toEqual(false);
   });
   
   
   it("Needs to detect inequality on date", function () {

      var lNew: Like = new Like(l1.name, new Date());

      expect(l1.equals(lNew)).toEqual(false);
   });

   it("Needs to correctly store attributes", function () {
         
      expect(l1.name === me).toEqual(true);
      expect(l1.when.getTime() === now.getTime()).toEqual(true);
   });

   it("Needs to copy construct", function () {

      let l2: Like = new Like(l1);

      expect(l1.equals(l2) === true).toEqual(true);
   });

   it("Needs to correctly change attributes", function () {

      var lNew: Like = new Like(l1.name, l1.when);

      lNew.name = them;
      lNew.when = nowThem;
     
      expect(l2.equals (lNew)).toEqual(true);
   });

   it("Needs to convert to and from JSON()", function () {

      var stream: string = l1.streamOut();

      var lNew: Like = new Like();
      lNew.streamIn(stream);
    
      expect(l1.equals(lNew)).toEqual(true);
   });   
});


