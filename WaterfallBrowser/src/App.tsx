import React from 'react';
import logo from './logo.svg';
import { FluentProvider, teamsDarkTheme, makeStyles } from '@fluentui/react-components';
import './App.css';
import ChunkView from './ChunkView';
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';

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

export function randomInt(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min)) + min;
}

export function randomKey(): string {
   return randomInt(0, 1000000000).toString();
}

function App() {

   const fluidFillPageClasses = fluidFillPageStyles();
   const pageOuterClasses = pageOuterStyles();
   const innerColumnClasses = innerColumnStyles();

   let now = new Date().toUTCString();

   let record: IStoredChunk = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: "1",
      created: now,
      amended: now,
      contextId: "madeupId",
      userId: "madeupId",
      className: "madeUpClass",
      functionalSearchKey: "1234",
      parentChunkId: 'parent',
      originalText: undefined,
      url: "https://microsoft.com",
      storedEmbedding: undefined,
      storedSummary: { modelId: randomKey(), text: "Summary lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
      storedTitle: { modelId: randomKey(), text: "Title" },
      relatedChunks: ['test', 'test2']
   }

   let obfusc = "NDliNjUxOTQtMjZlMS00MDQxLWFiMTEtNDA3ODIyOWY0Nzhh"
   let defusc = atob(obfusc);

   return (
      <FluentProvider theme={teamsDarkTheme} className={fluidFillPageClasses.root}>
         <div className={pageOuterClasses.root}>
            <div className={innerColumnClasses.root}>
               <ChunkView chunk={record} />
            </div>
         </div>
      </FluentProvider>
   );
}

export default App;
