import { readFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
import * as path from 'path';
import { IfcAPI } from "web-ifc";
import { LBDParser } from "../src";     // For development
// import { LBDParser } from "./dist/index.js";  // For testing the bundle
import { JsonLdDocument, toRDF } from 'jsonld';

const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
let mepModelData;

beforeAll(async () => {
    mepModelData = await readFileP(mepModelPath);
})

describe('FSO', () => {

    test('can parse MEP model with lengths converted to meters', async () => {

        // Init API and load model
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const modelID = ifcApi.OpenModel(mepModelData);

        // Init LBD Parser and parse FSO
        const lbdParser = new LBDParser();
        const fso = await lbdParser.parseFSOTriples(ifcApi, modelID);

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);
        
        // Get all RDF triples from returned JSON-LD object
        const rdf: any = await toRDF(fso as JsonLdDocument);
        const tripleCount = rdf.length;

        // Get length of specific pipe + aggregated length
        let pipeLength = 0;
        let totalPipeLength = 0;
        rdf.filter(triple => triple.predicate.value == "https://example.com/length").forEach(triple => {
            totalPipeLength+= parseFloat(triple.object.value);
            if(triple.subject.value == "https://example.com/3ToSAz1uv2RhyV07DgOmV3"){
                pipeLength = parseFloat(triple.object.value);
            }
        });
        totalPipeLength = Math.round( totalPipeLength * (10 ** 3) + Number.EPSILON ) / (10 ** 3);

        // Count components
        let componentCount = 0;
        let segmentCount = 0;
        let fittingCount = 0;
        let flowControllerCount = 0;
        let energyConversionDeviceCount = 0;
        let flowMovingDeviceCount = 0;
        let storageDeviceCount = 0;
        let terminalCount = 0;
        let treatmentDeviceCount = 0;
        let portCount = 0;
        let inPortCount = 0;
        let outPortCount = 0;
        let bidirectionalPortCount = 0;
        let systemCount = 0;
        rdf.filter(triple => triple.predicate.value == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type").forEach(triple => {
            if(triple.object.value == "https://w3id.org/fso#Component") componentCount++;
            if(triple.object.value == "https://w3id.org/fso#Segment") segmentCount++;
            if(triple.object.value == "https://w3id.org/fso#Fitting") fittingCount++;
            if(triple.object.value == "https://w3id.org/fso#FlowController") flowControllerCount++;
            if(triple.object.value == "https://w3id.org/fso#EnergyConversionDevice") energyConversionDeviceCount++;
            if(triple.object.value == "https://w3id.org/fso#FlowMovingDevice") flowMovingDeviceCount++;
            if(triple.object.value == "https://w3id.org/fso#StorageDevice") storageDeviceCount++;
            if(triple.object.value == "https://w3id.org/fso#Terminal") terminalCount++;
            if(triple.object.value == "https://w3id.org/fso#TreatmentDevice") treatmentDeviceCount++;

            if(triple.object.value == "https://w3id.org/fso#Port") portCount++;
            if(triple.object.value == "https://w3id.org/fso#InPort") inPortCount++;
            if(triple.object.value == "https://w3id.org/fso#OutPort") outPortCount++;
            if(triple.object.value == "https://w3id.org/fso#BidirectionalPort") bidirectionalPortCount++;

            if(triple.object.value == "https://w3id.org/fso#DistributionSystem") systemCount++;
        });

        // Count connections
        let connectedWithCount = 0;
        let connectedComponentCount = 0;
        let suppliesFluidToCount = 0;
        let hasFluidSuppliedByCount = 0;
        let hasComponentCount = 0;
        rdf.forEach(triple => {
            if(triple.predicate.value == "https://w3id.org/fso#connectedWith") connectedWithCount++;
            if(triple.predicate.value == "https://w3id.org/fso#connectedComponent") connectedComponentCount++;
            if(triple.predicate.value == "https://w3id.org/fso#suppliesFluidTo") suppliesFluidToCount++;
            if(triple.predicate.value == "https://w3id.org/fso#hasFluidSuppliedBy") hasFluidSuppliedByCount++;
            if(triple.predicate.value == "https://w3id.org/fso#hasComponent") hasComponentCount++;
        });

        // Count port center points
        let centerPointCount = 0;
        rdf.filter(triple => triple.predicate.value == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type").forEach(triple => {
            if(triple.object.value == "https://example.com/CenterPoint") centerPointCount++;
        });


        // Evaluate
        expect(Array.isArray(fso["@graph"])).toBe(true);
        expect(fso["@graph"].length).toBe(1691);
        expect(Array.isArray(rdf)).toBe(true);
        expect(tripleCount).toBe(2386);

        // Lengths
        expect(pipeLength).toBe(252.933);   // in mm as the model is in
        expect(totalPipeLength).toBe(24418.542);   // in mm as the model is in

        // Classified items
        expect(componentCount).toBe(85);
        expect(segmentCount).toBe(44);
        expect(fittingCount).toBe(30);
        expect(flowControllerCount).toBe(7);
        expect(energyConversionDeviceCount).toBe(0);
        expect(flowMovingDeviceCount).toBe(2);
        expect(storageDeviceCount).toBe(0);
        expect(terminalCount).toBe(2);
        expect(treatmentDeviceCount).toBe(0);
        expect(segmentCount+fittingCount+flowControllerCount
            +energyConversionDeviceCount+flowMovingDeviceCount
            +storageDeviceCount+terminalCount+
            treatmentDeviceCount).toBe(componentCount);

        expect(portCount).toBe(174);
        expect(inPortCount).toBe(87); // Half
        expect(outPortCount).toBe(87); // Half
        expect(bidirectionalPortCount).toBe(0);
        
        expect(systemCount).toBe(2);

        expect(connectedWithCount).toBe(172);
        expect(connectedComponentCount).toBe(174);
        expect(suppliesFluidToCount).toBe(86);
        expect(hasFluidSuppliedByCount).toBe(86);
        expect(hasComponentCount).toBe(262); // Why so many? Ports + components = 259 + some components are in multiple systems?

        expect(centerPointCount).toBe(174);


        // Next: Allow user to use the "normalizeToSI" which will convert all lengths to meters

    });

});