import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI } from "web-ifc";
import { LBDParser } from "../src";     // For development
// import { LBDParser } from "./dist/index.js";   // For testing the bundle
import { JsonLdDocument, toRDF } from 'jsonld';
import { JSONLD } from "../src/helpers/BaseDefinitions";

// Necessary for mocking jest
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
let duplexModelData;
let mepModelData;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
    mepModelData = await readFileP(mepModelPath);
})

describe('PROPERTIES', () => {

    test('can parse Duplex model', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const props = await lbdParser.parsePropertyTriples(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        const rdf: any = await toRDF(props as JsonLdDocument);
        const tripleCount = rdf.length;

        // Evaluate
        expect(Array.isArray(props["@graph"])).toBe(true);
        expect(props["@graph"].length).toBe(2680);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(15506);

    });

    test('can parse MEP model', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(mepModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const props = await lbdParser.parsePropertyTriples(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        const rdf: any = await toRDF(props as JSONLD);
        const tripleCount = rdf.length;

        // Get length of specific pipe
        

        // Evaluate
        expect(Array.isArray(props["@graph"])).toBe(true);
        expect(props["@graph"].length).toBe(678);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(1401);

    });

});