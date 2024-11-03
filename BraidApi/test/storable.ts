'use strict';
// Copyright Braid Technologies Ltd, 2024

import { expect } from 'expect';

import { IStorable } from '../../BraidCommon/src/IStorable';
import { IStorableRepostoryApiWrapper } from '../../BraidCommon/src/StorableRepositoryApi'; 

export function randomInt(min : number, max: number) : number {
   return Math.floor(Math.random() * (max - min)) + min;
}

export function randomKey () : string {
   return randomInt (0, 1000000000).toString();
}

export async function saveLoadRemove<TApi extends IStorableRepostoryApiWrapper> (api: TApi, record: IStorable) : Promise<boolean> {

   let saved = await api.save (record);    
   let loaded = await api.load (record.id as string);
   let removed = await api.remove (record.id as string);
   
   expect (saved === true).toEqual (true);
   expect (loaded && (loaded.id === record.id)).toBe (true);
   expect (removed === true).toEqual (true);

   return (saved === true) && (loaded?.id === record.id) && (removed === true);
}

export async function failSave <TApi extends IStorableRepostoryApiWrapper> (api: TApi, record: IStorable) : Promise<boolean> {

   let saved = await api.save (record);    
   expect (saved === false).toEqual (true);

   return (saved === false);
}