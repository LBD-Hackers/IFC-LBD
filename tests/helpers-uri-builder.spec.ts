import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import * as WebIFC from "web-ifc";
// import { helpers } from "../src";
import { helpers } from "../lib/bundles/bundle.esm";

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
let duplexModelData;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
})

describe('Helpers | uri-builder', () => {

    test('can build a URI', async () => {

        // ACT
        const res = helpers.uriBuilder.defaultURIBuilder("abc");

        // ASSERT
        expect(res).toBe("inst:abc");

    });

});