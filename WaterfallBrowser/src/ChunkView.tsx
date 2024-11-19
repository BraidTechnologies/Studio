import React from 'react';
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';

function ChunkView(props: {chunk: IStoredChunk}) {

    return (
        <div>
            <p><b>Waterfall Browser</b></p>
            &nbsp;            
            <p><b>{props.chunk.storedTitle?.text}</b></p>
            &nbsp;
            <p>{props.chunk.storedSummary?.text}</p>
            &nbsp;
            <p><a href={props.chunk.url}>{props.chunk.url}</a></p>
            &nbsp;
        </div>
    );
}

export default ChunkView;
