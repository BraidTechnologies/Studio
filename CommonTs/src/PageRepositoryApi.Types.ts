// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the PageRepository API

import { IStorable, IStorableQuerySpec} from "./IStorable";

/**
 * Interface representing a web page Chunk.
 * 
 * Core data for a Page:
 * - html: HTML content
 */
export interface IStoredPage extends IStorable {

   html: string;       // HTML content
}

// We have an explicit type for the input so code generators can identify it to generate test code
export interface IStoredPageRequest extends IStorableQuerySpec {

}

// We have an explicit type for the output so code generators can identify it to generate test code
export interface IStoredPageResponse extends IStoredPage {

}
