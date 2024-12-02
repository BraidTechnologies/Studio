import React from 'react';
import { FluentProvider, teamsDarkTheme, makeStyles } from '@fluentui/react-components';
import './App.css';
import ChunkRetriever from './ChunkRetriever';
import { retrieveChunk } from './ChunkRetriever';

const fluidFillPageStyles = makeStyles({
   root: {
      minWidth: "512px",  // Ask for enough for at least the error message  
      height: '100vh', /* fill the screen with flex layout */
      width: '100vw'   /* fill the screen with flex layout */      
   },
});

const pageOuterStyles = makeStyles({
   root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',  /* for a row, the main axis is vertical, flex-end is items aligned to the bottom of the row */
      justifyContent: 'center', /* for a row, the cross-axis is horizontal, center means vertically centered */
      height: '100vh', /* fill the screen with flex layout */
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

   // If you have a URL like `https://braidapps.io/chunks/123`, you can extract the path segments:
   const pathSegments = window.location.pathname.split('/');
   let chunkId : string | undefined = undefined;

   if (pathSegments.length >= 3) {
      chunkId = pathSegments[2]; // Assuming 'chunks' is the first segment
   }

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
