import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import * as WebIFC from "web-ifc";
// import { LBDParser, helpers } from "../src";
import { LBDParser, helpers } from "../lib/bundles/bundle.esm";
import { toRDF } from 'jsonld';
import { IFCELEMENT, IFCWALL, IFCWALLELEMENTEDCASE, IFCWALLSTANDARDCASE } from "web-ifc";

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
let duplexModelData;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
})

describe('Helpers | item-search', () => {

    test('can return subtypes of IFCWALL', async () => {

        // ACT
        const wallSubtypes = helpers.itemSearch.getItemSubtypes(IFCWALL);

        // ASSERT
        expect(Array.isArray(wallSubtypes)).toBe(true);
        expect(wallSubtypes.length).toBe(3);
        expect(wallSubtypes).toContain(IFCWALLSTANDARDCASE);
        expect(wallSubtypes).toContain(IFCWALL);
        expect(wallSubtypes).toContain(IFCWALLELEMENTEDCASE);

    });

    test('can return subtypes of IFCELEMENT', async () => {

        // ACT
        const wallSubtypes = helpers.itemSearch.getItemSubtypes(IFCELEMENT);

        // ASSERT
        expect(Array.isArray(wallSubtypes)).toBe(true);
        expect(wallSubtypes.length).toBe(137);
        expect(wallSubtypes).toContain(IFCWALLSTANDARDCASE);
        expect(wallSubtypes).toContain(IFCWALL);
        expect(wallSubtypes).toContain(IFCWALLELEMENTEDCASE);

    });

    test('can return all walls (and subtypes hereof) in a model', async () => {

        // ARRANGE
        const ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(duplexModelData);

        // ACT
        const instances = await helpers.itemSearch.getAllItemsOfTypeOrSubtype(ifcApi, modelID, IFCELEMENT);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(268);

    });

});