import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import * as WebIFC from "web-ifc";
// import { LBDParser } from "../src";
import { LBDParser, helpers } from "../lib/bundles/bundle.esm";
import { toRDF } from 'jsonld';
import { IFCBUILDINGSTOREY, IFCRELAGGREGATES, IFCRELVOIDSELEMENT, IFCSPACE } from "web-ifc";

const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
let duplexModelData;

beforeAll(async () => {
    duplexModelData = await readFileP(duplexModelPath);
})

describe('Helpers | path-search', () => {

    test('can search one-to-one relationships', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELVOIDSELEMENT,
            ifcSubjectRel: "RelatingBuildingElement",
            ifcTargetRel: "RelatedOpeningElement",
            rdfRelationship: "bot:hasSubElement"
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToOne(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(50);
        expect(str).toContain("bot:hasSubElement");

    });

    test('can search one-to-one relationships with opposite relationship', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELVOIDSELEMENT,
            ifcSubjectRel: "RelatingBuildingElement",
            ifcTargetRel: "RelatedOpeningElement",
            rdfRelationship: "bot:hasSubElement",
            oppoiteRelationship: "ex:subElementOf"
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToOne(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(100);
        expect(str).toContain("bot:hasSubElement");
        expect(str).toContain("bot:subElementOf");

    });

    test('can search one-to-one relationships with interfaces in-between', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELVOIDSELEMENT,
            ifcSubjectRel: "RelatingBuildingElement",
            ifcTargetRel: "RelatedOpeningElement",
            rdfRelationship: "bot:hasSubElement",
            includeInterface: true
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToOne(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(100);
        expect(str).toContain("bot:hasSubElement");
        expect(str).toContain("bot:Interface");
        expect(str).toContain("bot:interfaceOf");
        expect(str).toContain("ex:expressID");

    });

    test('can search one-to-many relationships', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELAGGREGATES,  // Relationship to search for
            ifcSubjectRel: "RelatingObject",    // The thing having the relationship
            ifcTargetRel: "RelatedObjects",     // The objects that the thing has the relationship to
            rdfRelationship: "ex:aggregates"    // The RDF predicate
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToMany(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(9);
        expect(str).toContain("ex:aggregates");

    });

    test('can search one-to-many relationships with restriction on subject class', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "ex:aggregatesFromStorey",
            ifcSubjectClassIn: [IFCBUILDINGSTOREY]          // Restriction on subject
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToMany(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(3);
        expect(str).toContain("ex:aggregatesFromStorey");

    });

    test('can search one-to-many relationships with restriction on target class', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "ex:aggregatesToSpace",
            ifcTargetClassIn: [IFCSPACE]                // Restriction on target
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToMany(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(3);
        expect(str).toContain("ex:aggregatesToSpace");

    });

    test('can search one-to-many relationships with restriction on both subject and target class', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "bot:hasSpace",
            ifcSubjectClassIn: [IFCBUILDINGSTOREY],     // Restriction on subject
            ifcTargetClassIn: [IFCSPACE]                // Restriction on target
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToMany(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(3);
        expect(str).toContain("bot:hasSpace");

    });

    test('can search one-to-many relationships with opposite relationship', async () => {

        // ARRANGE
        const ifcAPI = new WebIFC.IfcAPI();
        await ifcAPI.Init();
        const modelID = ifcAPI.OpenModel(duplexModelData);

        const input: helpers.pathSearch.Input = {
            ifcAPI,
            modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "bot:hasSpace",
            oppoiteRelationship: "ex:isSpaceOf",        // Opposite relationship
            ifcSubjectClassIn: [IFCBUILDINGSTOREY],
            ifcTargetClassIn: [IFCSPACE]
        }

        // ACT
        const instances = await helpers.pathSearch.buildRelOneToMany(input);
        const str: string = JSON.stringify(instances);

        // ASSERT
        expect(Array.isArray(instances)).toBe(true);
        expect(instances.length).toBe(24);
        expect(str).toContain("bot:hasSpace");
        expect(str).toContain("ex:isSpaceOf");

    });

    // NB! Not yet supported
    // test('can search one-to-many relationships and include interfaces', async () => {

    //     // ARRANGE
    //     const ifcAPI = new WebIFC.IfcAPI();
    //     await ifcAPI.Init();
    //     const modelID = ifcAPI.OpenModel(duplexModelData);

    //     const input: helpers.pathSearch.Input = {
    //         ifcAPI,
    //         modelID,
    //         ifcRelationship: IFCRELAGGREGATES,
    //         ifcSubjectRel: "RelatingObject",
    //         ifcTargetRel: "RelatedObjects",
    //         rdfRelationship: "bot:hasSpace",
    //         includeInterface: true,        // Include interfaces
    //         ifcSubjectClassIn: [IFCBUILDINGSTOREY],
    //         ifcTargetClassIn: [IFCSPACE]
    //     }

    //     // ACT
    //     const instances = await helpers.pathSearch.buildRelOneToMany(input);
    //     const str: string = JSON.stringify(instances);

    //     console.log(instances);

    //     // ASSERT
    //     expect(Array.isArray(instances)).toBe(true);
    //     expect(instances.length).toBe(3);
    //     expect(str).toContain("bot:hasSpace");

    // });

});