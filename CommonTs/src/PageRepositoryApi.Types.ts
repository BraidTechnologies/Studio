// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the PageRepository API

import { IStorable} from "./IStorable";

/**
 * Interface representing a chunk of data.
 * 
 * Core data for a chunk:
 * - html: HTML content
 */
export interface IStoredPage extends IStorable {

   html: string;       // HTML content
}
