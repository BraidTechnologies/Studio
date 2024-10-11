// Copyright (c) 2024 Braid Technologies Ltd
import { throwIfNull } from './Asserts';
import { EnvironmentError } from './Errors';
import { IKeyGenerator } from './IKeyGenerator';

let mockStoredSecret = "";

function NumberToUint32Array(f: number) :  Uint32Array {
   
   const buf = new ArrayBuffer(8);
   const floatView = new Float64Array(buf);
   const uintView = new Uint32Array(buf);

   floatView[0] = f;
   const randomValues = new Uint32Array(2);
   randomValues[0] = uintView[0];
   randomValues[1] = uintView[1];

   return randomValues;
}

export class UuidKeyGenerator implements IKeyGenerator {

   generateKey (): string {
      return uuid();
   }

   // Function to generate a random state value
   generateSecret(): string {
      
      // Upper and lower bounds
      const min = 1;
      const max = 100;

      // Generate random number within bounds
      let randomValues = new Uint32Array(2);
      if (typeof window === "undefined") {
         randomValues = NumberToUint32Array (Math.random ());         
      }
      else {
         window.crypto.getRandomValues(randomValues);         
      }

      const secureRandom = min + (randomValues[0] % (max - min + 1));   
      const secureRandomArray = new Array<number>();
      secureRandomArray.push (secureRandom);

      // Encode as UTF-8
      const utf8Encoder = new TextEncoder();
      const utf8Array = utf8Encoder.encode(
        String.fromCharCode.apply(null, secureRandomArray)
      );

      let utf8NumberArray = Array.from(utf8Array);

      // Base64 encode the UTF-8 data     
      return btoa(String.fromCharCode.apply(null, utf8NumberArray)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''));
   }      

   couldBeAKey(key: string): boolean {
      return looksLikeUuid (key);
   }

   saveSecret(secret: string): void {

      if (typeof localStorage === 'undefined') {
         mockStoredSecret = secret;
      }
      else {
         localStorage.setItem('secret', secret);
      }
   }

   matchesSavedSecret (secret: string): boolean {

      var stored;

      if (typeof localStorage === 'undefined') {
         stored = mockStoredSecret;
      }
      else {      
         stored = localStorage.getItem('secret');
      }

      return (stored === secret);
   }

   haveSavedSecret  () : boolean {
      var stored;

      if (typeof localStorage === 'undefined') {
         stored = mockStoredSecret;
      }
      else {      
         stored = localStorage.getItem('secret');
      }

      return stored !== null;
   }

   savedSecret  () : string {
      var stored : string;

      if (typeof localStorage === 'undefined') {
         stored = mockStoredSecret;
      }
      else {      
         let fromStorage = localStorage.getItem('secret');
         throwIfNull (fromStorage);
         stored = fromStorage;
      }

      return stored;
   } 

}

function generateUUID() { // Public Domain/MIT

    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function uuid(): string {

   var newUuid: string = "";
   
   // Check if Blob is supported in Browser as it is not supported in some Safari versions
   if (typeof Blob !== "undefined") {

      let url = URL.createObjectURL(new Blob());
      URL.revokeObjectURL(url);

      if (typeof window === 'undefined') {
         newUuid = url.split(":")[2];
      }
      else {
         switch (window.location.protocol) {
            case 'file:':
               newUuid = url.split("/")[1];
               break;
            case 'http:':
            case 'https:':
            default:
               newUuid = url.split("/")[3];
               break;
         }
      }
   }
   else {

      newUuid = generateUUID();
   }
   
   if (newUuid.length == 0)
      throw new EnvironmentError("Error creating UUID.");

   return newUuid;
}

export function looksLikeUuid(uuid: string): boolean {

   let split = uuid.split('-');

   if ((uuid.length == 36) && (split.length == 5)) {
      return true;
   }

   return false;
}