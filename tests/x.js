const { readFile } = require("fs");
const util = require("util");
const readFileP = util.promisify(readFile);
const path = require("path");
const WebIFC = require("web-ifc/web-ifc-api.js");
const LBDParser = require("../lib/cjs/index");
const { toRDF } = require("jsonld");


async function main(model){

    const duplexModelPath = path.join(__dirname, './artifacts/Duplex.ifc');
    const mepModelPath = path.join(__dirname, './artifacts/MEP.ifc');
    const duplexModelData = await readFileP(duplexModelPath);
    const mepModelData = await readFileP(mepModelPath);

    // Init API and load models
    const ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    let modelID;

    if(model == "duplex") modelID = ifcApi.OpenModel(duplexModelData);
    if(model == "mep") modelID = ifcApi.OpenModel(mepModelData);

    console.log('BOT: Duplex house');

    // Init LBD Parser and parse BOT
    const lbdParser = new LBDParser();
    const bot = await lbdParser.parseBOTTriples(ifcApi, modelID);

    // Close the model, all memory is freed
    ifcApi.CloseModel(modelID);
    
    // Get all RDF triples from returned JSON-LD object
    const rdf = await toRDF(bot);
    const tripleCount = rdf.length;

    console.log("BOT Graph length should be 839");
    console.log("Is: " + bot["@graph"].length);
    console.log("BOT triple count should be 1718");
    console.log("Is: " + tripleCount);

}

main("duplex");