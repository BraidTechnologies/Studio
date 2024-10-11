// Copyright (c) 2024 Braid Technologies Ltd

const youTubeHostname = "www.youtube.com";
const gitHubHostname = "github.com";

export function lookLikeSameSource (url1: string, url2: string ) : boolean {

   const URLLeft = new URL (url1);
   const URLRight = new URL (url2);

   // Youtube format URL
   // https://www.youtube.com/watch?v=l5mG4z343qg&t=00h00m00s
   // To compare two YouTube URLs we look at the ?v= parameter for the video ID
   if (URLLeft.hostname === (youTubeHostname) && URLRight.hostname === (youTubeHostname)) {
      const videoLeft = URLLeft.searchParams.get('v');
      const videoRight = URLRight.searchParams.get('v');  
      
      if (videoLeft === videoRight)
         return true;
      else
         return false;

   }

   // GitHub format URL
   // https://github.com/organisation/repo/...
   // To compare two GitHub URLs we look at the first two path paramters   
   const pathLeft = URLLeft.pathname.split('/').slice (1);
   const pathRight = URLRight.pathname.split('/').slice(1);

   if (URLLeft.hostname === (gitHubHostname) && URLRight.hostname === (gitHubHostname) 
      && (pathLeft.length >= 2) && (pathRight.length >= 2)) {

      if (pathLeft[0] === pathRight[0] && pathLeft[1] === pathRight[1])
         return true;
      else
         return false;
   }

   // To compare two Web URLs we look at the first path paramters  
   if ((URLLeft.hostname === URLRight.hostname) && 
       (pathLeft.length >= 1) && (pathRight.length >= 1)) {

         if (pathLeft[0] === pathRight[0])
            return true;
         else
            return false;
   }

   return false;
}