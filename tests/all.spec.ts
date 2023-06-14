import { readFile, writeFileSync } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI } from "web-ifc";
// import { LBDParser } from "../dist/index.cjs";
import { LBDParser, ParserSettings, SerializationFormat } from "../src";
import {normalize, toRDF} from "jsonld";

// Necessary for mocking jest
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
let duplexModelData;
let mepModelData;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
    mepModelData = await readFileP(mepModelPath);
})

describe('Parse all', () => {

    test('per default parses both BOT, FSO, PROPERTIES and PRODUCTS', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const settings = new ParserSettings();
        const lbdParser = new LBDParser(settings);
        
        const bot: any = await lbdParser.parse(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        let rdf: any = await toRDF(bot);
        const tripleCount = rdf.length;

        // Evaluate
        expect(Array.isArray(bot["@graph"])).toBe(true);
        expect(bot["@graph"].length).toBe(4037);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(17899);

    });

    test('can be configured to return NQuads instead of JSONLD', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const settings = new ParserSettings();
        settings.outputFormat = SerializationFormat.NQuads;
        const lbdParser = new LBDParser(settings);
        
        const bot: any = await lbdParser.parse(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        const tripleCount = bot.split("\n").filter(triple => triple.trim() != "").length;

        // Evaluate
        expect(typeof bot).toBe("string");
        expect(tripleCount).toBe(17899);

    });

    test('namespace can be specified', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const settings = new ParserSettings();
        settings.namespace = "https://my-awesome-namespace.com/resources/";
        const lbdParser = new LBDParser(settings);
        
        const bot: any = await lbdParser.parse(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Evaluate
        expect(bot["@context"]["@base"]).toBe(settings.namespace);
        expect(bot["@context"].inst).toBe(settings.namespace);

    });

    test('can parse only BOT triples using the generic parser based on settings', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // Init LBD Parser and parse BOT
        const settings = new ParserSettings();
        settings.subsets = {
            BOT: true,
            FSO: false,
            PRODUCTS: false,
            PROPERTIES: false
        };
        const lbdParser = new LBDParser(settings);

        const bot: any = await lbdParser.parse(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        let rdf: any = await toRDF(bot);
        const tripleCount = rdf.length;

        // Evaluate
        expect(Array.isArray(bot["@graph"])).toBe(true);
        expect(bot["@graph"].length).toBe(1003);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(2124);

    });

});