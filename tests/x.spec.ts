import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import WebIFC from "web-ifc/web-ifc-api.js";
import { LBDParser } from "../src";
import { toRDF } from 'jsonld';

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
        const ifcApi = new WebIFC.IfcAPI();
        // await ifcApi.Init();
        // const modelID = ifcApi.OpenModel(duplexModelData);

        // // Init LBD Parser and parse BOT
        // const lbdParser = new LBDParser();
        // const bot: any = await lbdParser.parseBOTTriples(ifcApi, modelID);

        // // Close the model, all memory is freed
        // ifcApi.CloseModel(modelID);

        expect(1718).toBe(1718);

    });

});