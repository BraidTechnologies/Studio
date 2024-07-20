// Copyright (c) 2024 Braid Technologies Ltd


export function logCoreError (description: string, details: any) : void {

   console.error ("Core error:" + description + "Details:" + details.toString());
}

export function logDbError (description: string, details: any) : void {

   console.error ("Database error:" + description + "Details:" + details.toString());
}

export function logApiError (description: string, details: any) : void {

   console.error ("Api error:" + description + "Details:" + details.toString());
}

export function logApiInfo (description: string, details: any) : void {

   console.log ("Api Info:" + description + "Details:" + details.toString());
}