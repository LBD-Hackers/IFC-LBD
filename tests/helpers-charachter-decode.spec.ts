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

describe('Helpers | character-decode', () => {

    test('can decode æøå', async () => {

        // ARRANGE
        const str: string = `G\\X2\\00E6\\X0\\t hvad vi g\\X2\\00F8\\X0\\r eller vi g\\X2\\00E5\\X0\\r`;

        // ACT
        const res = helpers.characterDecode.decodeString(str);

        // ASSERT
        expect(res).toBe(`Gæt hvad vi gør eller vi går`);

    });

    test('can decode æøå short', async () => {

        // ARRANGE
        const str: string = `G\\X\\E6t hvad vi g\\X\\F8r eller vi g\\X2\\00E5\\X0\\r`;

        // ACT
        const res = helpers.characterDecode.decodeString(str);

        // ASSERT
        expect(res).toBe(`Gæt hvad vi gør eller vi går`);

    });

    test('can decode ÆØÅ', async () => {

        // ARRANGE
        const str: string = `G\\X2\\00C6\\X0\\t hvad vi g\\X2\\00D8\\X0\\r eller vi g\\X2\\00C5\\X0\\r`;

        // ACT
        const res = helpers.characterDecode.decodeString(str);

        // ASSERT
        expect(res).toBe(`GÆt hvad vi gØr eller vi gÅr`);

    });

    test('can decode æøå short', async () => {

        // ARRANGE
        const str: string = `G\\X\\C6t hvad vi g\\X\\D8r eller vi g\\X2\\00C5\\X0\\r`;

        // ACT
        const res = helpers.characterDecode.decodeString(str);

        // ASSERT
        expect(res).toBe(`GÆt hvad vi gØr eller vi gÅr`);

    });

    // NB! How about ö, Ü, Â and Ö?
    test('can decode üä', async () => {

        // ARRANGE
        const str: string = `M\\X\\FCll oder \\X\\F6pfel`;

        // ACT
        const res = helpers.characterDecode.decodeString(str);

        // ASSERT
        expect(res).toBe(`Müll oder äpfel`);

    });

    test('can decode üä short', async () => {

        // ARRANGE
        const str: string = `M\\X2\\00FC\\X0\\ll oder \\X2\\00F6\\X0\\pfel`;

        // ACT
        const res = helpers.characterDecode.decodeString(str);

        // ASSERT
        expect(res).toBe(`Müll oder äpfel`);

    });

});