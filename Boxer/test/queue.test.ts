// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { Queue } from '../core/Queue';

describe("Queue", function () {
  
   
   it("returns empty when initialised.", function () {
      
      let queue = new Queue<string>();
      expect(queue.peek()).toEqual(undefined); 
   });
   
   it("Enqueues & dequeues single item.", function () {

      let queue = new Queue<string>();
      queue.enqueue("One");
      expect(queue.peek()).toEqual("One");
      queue.dequeue();
      expect(queue.peek()).toEqual(undefined); 
   });
   
   it("Enqueues & dequeues multiple items.", function () {

      let queue = new Queue<string>();
      queue.enqueue("One");
      queue.enqueue("Two");
      expect(queue.peek()).toEqual("One");
      queue.dequeue();
      expect(queue.peek()).toEqual("Two");
   });
});

