'use strict';
// Copyright Braid Technologies Ltd, 2024

import axios from 'axios';
import { expect } from 'expect';
import { describe, it } from 'mocha';

import { randomKey } from './storable';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { PageRepostoryApi } from '../../CommonTs/src/PageRepositoryApi'
import { IStoredPage } from '../../CommonTs/src/PageRepositoryApi.Types';

declare var process: any;

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Loads HTML content from a file in the filesystem
 * 
 * @param fileName - The name of the HTML file to load
 * @returns The HTML content as a string
 * @throws Error if file cannot be read or does not exist
 */
function loadHtmlFromFile(fileName: string): string {
    try {
        // Read the file synchronously using absolute path
        const filePath = join(process.cwd(), fileName);
        const htmlContent = readFileSync(filePath, 'utf-8');
        return htmlContent;
    } catch (error: any) {
        throw new Error(`Failed to load HTML file ${fileName}: ${error.message}`);
    }
}

describe("StorablePage", async function () {

   let now = new Date().toUTCString();

   let env = getEnvironment(EEnvironment.kLocal);
   let api = new PageRepostoryApi(env, process.env.SessionKey.toString());

   let key = randomKey();
   let htmlFromFile = loadHtmlFromFile ("test/page_test.html");
   let htmlCompressed = api.compressString (htmlFromFile);

   it("Needs to succeed with save & valid key in local environment", async function () {
      
      let record: IStoredPage = {
         id: randomKey(),
         applicationId: "Test",
         schemaVersion: "1",
         created: now,
         amended: now,
         contextId: "madeupId",
         userId: "madeeupId",
         className: "madeUpClass",
         functionalSearchKey: "1234",
         html: htmlCompressed
      }

      let myRecord = { ...record };
      myRecord.id = key;

      let ok = await api.save (myRecord);

      expect(ok).toBe(true);

   }).timeout(20000);

   it("Needs to succeed with load & valid key in local environment", async function () {

      var response: any;

      let environment = getEnvironment(EEnvironment.kLocal);

      let url = environment.getPageApi() 
         + "?id=" + key.toString();

      response = await axios.post(url);     
      
      let html = response.data;

      expect(html).toBe(htmlFromFile);

   }).timeout(20000);   

});