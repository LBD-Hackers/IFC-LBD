import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI } from "web-ifc";
import { LBDParser } from "../src";
// import { LBDParser } from "./dist/index.js";

// Necessary for mocking jest
import { enableFetchMocks } from 'jest-fetch-mock';
import { JsonLdDocument } from "jsonld";
enableFetchMocks();

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
let duplexModelData;
let mepModelData;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
    mepModelData = await readFileP(mepModelPath);
})

describe('PRODUCTS', () => {

    test('can parse Duplex house', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse Products
        const lbdParser = new LBDParser();
        const triples = await lbdParser.parse(ifcApi, modelID);
        const doc: JsonLdDocument = JSON.parse(triples);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Evaluate
        expect(Array.isArray(doc["@graph"])).toBe(true);
        expect(doc["@graph"].length).toBe(354);

    });

    test('can parse MEP model', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(mepModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const triples = await lbdParser.parse(ifcApi, modelID);
        const doc: JsonLdDocument = JSON.parse(triples);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Evaluate
        expect(Array.isArray(doc["@graph"])).toBe(true);
        expect(doc["@graph"].length).toBe(91);

    });

});