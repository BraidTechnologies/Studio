// Copyright (c) 2024 Braid Technologies Ltd

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