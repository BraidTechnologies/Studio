// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module Debounce
 * @description Provides a utility function for debouncing function calls.
 * 
 * This module includes the debounce function which takes a function and a delay,
 * and returns a new function that will call the original function after the delay,
 * but not more frequently than once per delay period.
 */

import { throwIfNull } from "./Asserts";

export function debounce(fn_ : Function, ms_: number) : Function {

   return () => {

      var timer: NodeJS.Timeout | null = null;
      
      const nested = () => {
         throwIfNull(timer);
         clearTimeout(timer);         
         timer = null;
         fn_();
      };

      timer = setTimeout(nested, ms_);
   };
}