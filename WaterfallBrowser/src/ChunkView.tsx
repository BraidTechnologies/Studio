import React, { ReactNode } from 'react';
import { IStoredChunk } from './CommonTs/src/ChunkRepositoryApi.Types';
import { uiAppName, uiBackToParentChunk, uiRelatedChunks } from './UIString';

/**
 * Generates a ReactNode that provides a link back to a parent element.
 *
 * @param value - The identifier for the parent element, used to construct the URL.
 * @returns A paragraph element containing a link if the value is provided, or an empty paragraph if undefined.
 */
function backToParent (value: string | undefined) : ReactNode {

   if (value) {
      let relatedUrl = '/chunks/' + value.toString();

      return (<p>{uiBackToParentChunk} <a href={relatedUrl}>{value}</a> </p>)
   }
   else
      return <p></p>
}

/**
 * Maps a string value to a ReactNode containing a paragraph with a hyperlink.
 *
 * @param value - The string value used to generate the URL and key for the ReactNode.
 * @param index - The index of the current element in the array (unused).
 * @param all - The array of strings being processed (unused).
 * @returns A ReactNode containing a paragraph with a hyperlink pointing to a URL
 *          constructed from the input string value.
 */
function mapRelated (value: string, index: number, all: Array<string>) : ReactNode {

   let relatedUrl = '/chunks/' + value.toString();
   let nodeWithKey : ReactNode = <p key={value}> <a href={relatedUrl}>{value}</a> </p>;

   return (nodeWithKey)
}

/**
 * Renders a view for a stored chunk, displaying its title, summary, and URL.
 * Includes navigation to the parent chunk and lists related chunks if available.
 * 
 * @param props - Contains the stored chunk data to be displayed.
 * @returns A ReactNode representing the chunk view.
 */
export function ChunkView(props: {chunk: IStoredChunk}) {

    
    return (
        <div>
            <p><b>{uiAppName}</b></p>
            &nbsp;                   
            <p><b>{props.chunk.storedTitle?.text}</b></p>
            &nbsp;
            <p>{props.chunk.storedSummary?.text}</p>
            &nbsp;
            <p><a href={props.chunk.url}>{props.chunk.url}</a></p>
            &nbsp;
            {backToParent (props.chunk.parentChunkId)}
            &nbsp;
            {props.chunk.relatedChunks ? <p>{uiRelatedChunks}</p> : <div/>}            
            {props.chunk.relatedChunks ? props.chunk.relatedChunks.map (mapRelated) : <div/>}
            &nbsp;
        </div>
    );
}

export default ChunkView;
