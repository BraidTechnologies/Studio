import React, { useState } from 'react';
import { IStoredChunk } from './CommonTs/src/ChunkRepositoryApi.Types';
import { ChunkRepostoryApi } from './CommonTs/src/ChunkRepositoryApi';
import { getDefaultEnvironment, getDefaultFluidEnvironment } from './CommonTs/src/IEnvironmentFactory';
import { ChunkView } from './ChunkView';
import { ChunkViewError } from './ChunkViewError';
import { ChunkViewLoading } from './ChunkViewLoading';

/**
 * Type for a function that returns an IStoredChunk given a key. 
 * This allows test code to replace it with a stub.
 * Production calls the relevant API. 
 **/
export type ChunkRetriveFunction = (chunkId: string | undefined) => Promise <IStoredChunk | undefined>;

/**
 * A React component that retrieves and displays a chunk of data using a provided retrieval function.
 * 
 * @param props - The properties for the component.
 * @param props.chunkId - The unique identifier for the chunk to be retrieved.
 * @param props.retrieverFn - A function that retrieves the chunk data based on the chunkId.
 * 
 * @returns A JSX element displaying the retrieved chunk using the ChunkView component, 
 * or an empty div if the chunk is not yet retrieved.
 * 
 * The component manages the retrieval state using internal state variables to track if the retrieval
 * process is ongoing or completed, and updates the UI accordingly.
 */
export function ChunkRetriever (props: {chunkId: string | undefined, retrieverFn: ChunkRetriveFunction}) {
    
    const [chunk, setChunk] = useState<IStoredChunk | undefined> (undefined);
    const [calling, setCalling] = useState<boolean> (false);    
    const [called, setCalled] = useState<boolean> (false);  

    if (!chunk && props.chunkId) {
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
      chunk ? <ChunkView chunk={chunk as unknown as IStoredChunk}/> 
            : calling ? <ChunkViewLoading/> 
                      : <ChunkViewError/>
    );
}

export default ChunkRetriever;

/**
 * Asynchronously retrieves a stored chunk by its unique identifier.
 *
 * @param chunkId - The unique identifier of the chunk to be retrieved.
 * @returns A promise that resolves to the retrieved IStoredChunk or undefined if not found.
 *
 * The function decodes an obfuscated string to obtain an API key, initializes
 * the ChunkRepositoryApi with the default environment and the decoded key,
 * and attempts to load the chunk using the provided chunkId.
 */
export async function retrieveChunk(chunkId: string | undefined): Promise<IStoredChunk | undefined> {

   let obfusc = "NDliNjUxOTQtMjZlMS00MDQxLWFiMTEtNDA3ODIyOWY0Nzhh"
   let defusc = atob(obfusc);

   let env = getDefaultEnvironment();
   let api = new ChunkRepostoryApi(env, defusc);

   if (chunkId) {
      let loaded = await api.load(chunkId);
      let loadedChunk: IStoredChunk | undefined = loaded as IStoredChunk | undefined;

      return loadedChunk;
   }
   else
      return undefined;
}
