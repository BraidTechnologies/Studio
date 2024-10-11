// Copyright (c) 2024 Braid Technologies Ltd

//==============================//
// Media class
//==============================//
export class Media {  

   listeners: Array<Function>;
   isMobileFormFactorQuery: MediaQueryList;

   /**
    * Initialises repository 
    */
   constructor() {
      this.listeners = new Array();
      this.isMobileFormFactorQuery = window.matchMedia("(max-width: 1023px)");
      this.isMobileFormFactorQuery.addListener(this.onMobileFormFactorChange.bind(this));
   }

   /**
    *
    * isSmallFormFactor - provides a one-time response
    * if the display is at or below mobile form factor boundary.
    */
   isSmallFormFactor(): boolean {

      if (this.isMobileFormFactorQuery.matches) { // If media query matches
         return true;
      } else {
         return false;
      }
   }

  /**
    *
    * onSmallFormFactorChange - local hook on mobile form factor changes. 
    */
   onMobileFormFactorChange(): void {
      var matches: boolean = false;

      if (this.isMobileFormFactorQuery.matches) { // If media query matches
         matches = true;
      } 
      for (var i = 0; i < this.listeners.length; i++) {
         this.listeners[i](matches);
      }
   }

  /**
    *
    * addMobileFormFactorChangeListener - hook on external listeners to be fired if the display transitions across mobile form factor boundary.
    */
   addMobileFormFactorChangeListener(fn: Function) {
      this.listeners.push(fn);
   }
}
