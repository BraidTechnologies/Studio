/**
 * Decodes an obfuscated string using base64 decoding
 * @returns {string} The decoded string value
 */
export function getDefusc (): string {
   let obfusc = "NDliNjUxOTQtMjZlMS00MDQxLWFiMTEtNDA3ODIyOWY0Nzhh"
   let defusc = atob(obfusc);

   return defusc;
}
