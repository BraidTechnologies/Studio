import React from 'react';

import { uiAppName, uiSorryNoData } from './UIString';

export function ChunkViewError () {

    
    return (
        <div>
            <p><b>{uiAppName}</b></p>
            &nbsp;                   
            <p>{uiSorryNoData}</p>
            &nbsp;
        </div>
    );
}

export default ChunkViewError;
