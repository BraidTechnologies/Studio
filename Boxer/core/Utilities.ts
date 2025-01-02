// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module Utilities
 * @description Provides utility functions for the Boxer application.
 * 
 * This module includes the areSameDate, areSameShallowArray, and areSameDeepArray functions which handle:
 * - Comparing dates
 * - Comparing shallow arrays
 * - Comparing deep arrays
 */

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

export function areSameDeepArray<T> (lhs: Array<T>, rhs : Array<T>) : boolean {

   if (lhs.length !== rhs.length) {
      return false;
   }        

   for (let i = 0; i < lhs.length; i++) {
      if (! (JSON.stringify (lhs[i]) === JSON.stringify (rhs[i])))
         return false;
   }

   return true;
}