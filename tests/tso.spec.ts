import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI } from "web-ifc";
import { LBDParser } from "../src";     // For development
// import { LBDParser } from "./dist/index.js";   // For testing the bundle
import { toRDF } from 'jsonld';

// Necessary for mocking jest
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
let mepModelData;

beforeAll(async () => {
    mepModelData = await readFileP(mepModelPath);
})

describe('TSO', () => {

    test('can parse MEP model', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(mepModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const tso: any = await lbdParser.parseTSOTriples(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        const rdf: any = await toRDF(tso);
        const tripleCount = rdf.length;

        // Evaluate
        expect(Array.isArray(tso["@graph"])).toBe(true);
        expect(tso["@graph"].length).toBe(607);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(607);

    });

});