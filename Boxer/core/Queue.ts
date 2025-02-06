/*! Copyright Braid Technologies 2022 */
/**
 * @module Queue
 * @description Provides a generic queue data structure implementation for the Boxer application.
 * 
 * This module includes the Queue class which handles:
 * - Creating and managing FIFO (First-In-First-Out) queues
 * - Basic queue operations like enqueue, dequeue, isEmpty, and length
 * - Efficient memory management through offset-based dequeuing
 */


//==============================//
// Queue class
//==============================//

export class Queue<T> {

      // initialise the queue and offset
   queue: Array<T>;
   offset: number; 

   /**
    * Creates a Queue
    */
   constructor() {
      this.offset = 0
      this.queue = new Array<T>();
   }

   // Returns the length of the queue.
   getLength () : number {
      return (this.queue.length - this.offset);
   }

   // Returns true if the queue is empty, and false otherwise.
   isEmpty () : boolean {
      return (this.queue.length == 0);
   }

   /* Enqueues the specified item. The parameter is:
    *
    * item - the item to enqueue
    */
   enqueue (item: T) {
      this.queue.push(item);
   }

   /* Dequeues an item and returns it. If the queue is empty, the value
    * 'undefined' is returned.
    */
   dequeue (): T | undefined {

      // if the queue is empty, return immediately
      if (this.queue.length == 0) return undefined;

      // store the item at the front of the queue
      let item = this.queue[this.offset];

      // increment the offset and remove the free space if necessary
      if (++(this.offset) * 2 >= this.queue.length) {
         this.queue = this.queue.slice(this.offset);
         this.offset = 0;
      }

      // return the dequeued item
      return item;

   }

   /* Returns the item at the front of the queue (without dequeuing it). If the
    * queue is empty then undefined is returned.
    */
   peek(): T | undefined {
      return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
   }
}
