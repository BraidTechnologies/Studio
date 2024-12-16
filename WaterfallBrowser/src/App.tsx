import React from 'react';
import { createRoot } from "react-dom/client";
import { FluentProvider, teamsDarkTheme, makeStyles } from '@fluentui/react-components';
import ChunkRetriever from './ChunkRetriever';
import { retrieveChunk } from './ChunkRetriever';

const fluidFillPageStyles = makeStyles({
   root: {
      minWidth: "512px",  // Ask for enough for at least the error message  
      height: '100%',  /* fill the screen with flex layout */
      width: '100vw'   /* fill the screen with flex layout */      
   },
});

const pageOuterStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',    /* for a row, the main axis is vertical, flex-end is items aligned to the bottom of the row */
      justifyContent: 'center', /* for a row, the cross-axis is horizontal, center means vertically centered */
      height: '100%',  /* fill the screen with flex layout */
      width: '100vw',  /* fill the screen with flex layout */
      marginLeft: '0px',
      marginRight: '0px',
      marginTop: '0px',
      marginBottom: '0px',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
      paddingBottom: '20px',
      webkitTextSizeAdjust: '100%'
   },
});

export const innerColumnStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',    // start layout at the top       
      alignItems: 'left',
      maxWidth: '896px',
      width: '100vw',  /* fill the screen with flex layout */      
   },
});

function App() {

   const fluidFillPageClasses = fluidFillPageStyles();
   const pageOuterClasses = pageOuterStyles();
   const innerColumnClasses = innerColumnStyles();

   let chunkId : string | undefined = undefined;

   const params = new URLSearchParams(window.location.search);
   let chunkParam = params.get("id");
   console.log(chunkParam); 

   if (chunkParam) {
      chunkId = chunkParam; 
   }
   console.log (chunkId);
   return (
      <FluentProvider theme={teamsDarkTheme} className={fluidFillPageClasses.root}>
         <div className={pageOuterClasses.root}>
            <div className={innerColumnClasses.root}>
               <ChunkRetriever chunkId={chunkId} retrieverFn={retrieveChunk} />
            </div>
         </div>
      </FluentProvider>
   );
}

export default App;

// This allows code to be loaded in node.js for tests, even if we dont run actual React methods
if (document !== undefined && document.getElementById !== undefined) {
   const root = createRoot(document.getElementById("reactRoot") as HTMLElement);
   root.render(
      <App />
   ); 
}
