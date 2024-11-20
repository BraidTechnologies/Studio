import React, { ReactNode } from 'react';
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';

function backToParent (value: string | undefined) : ReactNode {

   if (value) {
      let relatedUrl = './chunks/' + value.toString();

      return (<p>Back to parent element: <a href={value}>{value}</a> </p>)
   }
   else
      return <p></p>
}

function mapRelated (value: string, index: number, all: Array<string>) : ReactNode {

   let relatedUrl = './chunks/' + value.toString();

   return (<p> <a href={relatedUrl}>{relatedUrl}</a> </p>)
}

export function ChunkView(props: {chunk: IStoredChunk}) {

    
    return (
        <div>
            <p><b>Waterfall Browser</b></p>
            &nbsp;           
            <p><a href={props.chunk.url}>{props.chunk.url}</a></p>             
            <p><b>{props.chunk.storedTitle?.text}</b></p>
            &nbsp;
            <p>{props.chunk.storedSummary?.text}</p>
            &nbsp;
            <p><a href={props.chunk.url}>{props.chunk.url}</a></p>
            &nbsp;
            {backToParent (props.chunk.parentChunkId)}
            &nbsp;
            {props.chunk.relatedChunks ? props.chunk.relatedChunks.map (mapRelated) : <div/>}
            &nbsp;
        </div>
    );
}

export default ChunkView;
