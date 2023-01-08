import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI } from "web-ifc";
// import { LBDParser } from "../dist/index.cjs";
import { JSONLD, LBDParser, ParserSettings } from "../src";
import { JsonLdDocument, toRDF } from 'jsonld';

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

describe('BOT', () => {

    test('can parse Duplex house', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const triples = await lbdParser.parse(ifcApi, modelID);
        const doc: JsonLdDocument = JSON.parse(triples);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        let rdf: any = await toRDF(doc);
        const tripleCount = rdf.length;

        // Evaluate
        expect(Array.isArray(doc["@graph"])).toBe(true);
        expect(doc["@graph"].length).toBe(839);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(1718);

    });

    test('can parse MEP model', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const triples = await lbdParser.parse(ifcApi, modelID);
        const doc: JsonLdDocument = JSON.parse(triples);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        let rdf: any = await toRDF(doc);
        const tripleCount = rdf.length;

        // Evaluate
        expect(Array.isArray(doc["@graph"])).toBe(true);
        expect(doc["@graph"].length).toBe(839);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(1718);

    });

});