import "babel-polyfill";
import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import * as WebIFC from "web-ifc/web-ifc-api.js";
import { LBDParser } from "../src";
import * as jsonld from 'jsonld';

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
let duplexModelData: Buffer;
let mepModelData: Buffer;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
    mepModelData = await readFileP(mepModelPath);
})

describe('PRODUCTS', () => {

    test('can parse Duplex house', async () => {

        // Init API and load model
        const ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const lbdParser = new LBDParser();
        const products = await lbdParser.parseProductTriples(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Evaluate
        expect(Array.isArray(products["@graph"])).toBe(true);
        expect(products["@graph"].length).toBe(218);

    });

    // test('can parse MEP model', async () => {

    //     // Init API and load model
    //     const ifcApi = new WebIFC.IfcAPI();
    //     await ifcApi.Init();
    //     const modelID = ifcApi.OpenModel(duplexModelData);

    //     // Init LBD Parser and parse BOT
    //     const lbdParser = new LBDParser();
    //     const bot = await lbdParser.parseBOTTriples(ifcApi, modelID);

    //     // Close the model, all memory is freed
    //     ifcApi.CloseModel(modelID);
        
    //     // Get all RDF triples from returned JSON-LD object
    //     const rdf: any = await jsonld.toRDF(bot);
    //     const tripleCount = rdf.length;

    //     // Evaluate
    //     expect(Array.isArray(bot["@graph"])).toBe(true);
    //     expect(bot["@graph"].length).toBe(838);
    //     expect(Array.isArray(rdf)).toBe(true);
    //     expect(tripleCount).toBe(1717);

    // });

});