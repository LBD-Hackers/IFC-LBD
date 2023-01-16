import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI, IFCPRODUCT } from "web-ifc";
// import { LBDParser } from "../dist/index.cjs";
import { helpers } from "../src";

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

describe('Helpers', () => {

    test('Get all products', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        const products = await helpers.itemSearch.getAllItemsOfTypeOrSubtype(
            ifcApi,
            modelID,
            IFCPRODUCT,
        );

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Evaluate
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBe(295);

    });

    test('Decode a text string', async () => {

        const strIn = "Hj\\X\\E6lp";
        const expectedOut = "Hjælp";

        const strOut = await helpers.characterDecode.decodeString(strIn);

        // Evaluate
        expect(strOut).toBe(expectedOut);

    });

});