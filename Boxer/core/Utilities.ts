// Copyright (c) 2024 Braid Technologies Ltd

import { throwIfUndefined } from './Asserts';

export function areSameDate (lhs: Date | undefined, rhs : Date | undefined) : boolean {

   if (typeof lhs === 'undefined' && typeof rhs === 'undefined') {
      return true;
   }
   if (typeof lhs === 'undefined' && typeof rhs !== 'undefined') {
      return false;
   } 
   if (typeof lhs !== 'undefined' && typeof rhs === 'undefined') {
      return false;
   }        
   throwIfUndefined (lhs);
   throwIfUndefined (rhs);
   if (lhs.getTime() === rhs.getTime()) {
      return true;
   }
   return false;
}

export function areSameShallowArray<T> (lhs: Array<T>, rhs : Array<T>) : boolean {

   if (lhs.length !== rhs.length) {
      return false;
   }        

   for (let i = 0; i < lhs.length; i++) {
      if (lhs[i] !== rhs[i])
         return false;
   }

   return true;
}


export interface Comparable<T> {
   equals (rhs: T) : boolean;
}

export function areSameDeepArray<T extends Comparable<T>> (lhs: Array<T>, rhs : Array<T>) : boolean {

   if (lhs.length !== rhs.length) {
      return false;
   }        

   for (let i = 0; i < lhs.length; i++) {
      if (! (lhs[i].equals (rhs[i])))
         return false;
   }

   return true;
}