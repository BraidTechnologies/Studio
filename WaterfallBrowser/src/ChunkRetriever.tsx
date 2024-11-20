import React, { ReactNode, useState } from 'react';
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';
import { ChunkView } from './ChunkView';

export type ChunkRetriveFunction = (chunkId: string) => Promise <IStoredChunk | undefined>;

export function ChunkRetriever (props: {chunkId: string, retrieverFn: ChunkRetriveFunction}) {
    
    const [chunk, setChunk] = useState<IStoredChunk | undefined> (undefined);
    const [calling, setCalling] = useState<boolean> (false);    
    const [called, setCalled] = useState<boolean> (false);  

    if (!chunk) {
       if (!calling && !called) {

       setCalling (true);
        props.retrieverFn (props.chunkId).then ((prom) => {
            setCalling (false);
            setCalled (true);

            let retrivedChunk = prom;
            if (retrivedChunk)
               setChunk (retrivedChunk);
        }).catch ((e) => {
            setCalling (false);
            setCalled (true);

        })
      }
    }
    
    return (
      chunk ? <ChunkView chunk={chunk as unknown as IStoredChunk}/> : <div></div>
    );
}

export default ChunkRetriever;
