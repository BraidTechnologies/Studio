import React from 'react';

import { uiAppName, uiLoading } from './UIString';

export function ChunkViewLoading () {

    
    return (
        <div>
            <p><b>{uiAppName}</b></p>
            &nbsp;                   
            <p>{uiLoading}</p>
            &nbsp;
        </div>
    );
}

export default ChunkViewLoading;
