import * as WebIFC from "web-ifc/web-ifc-api";
import { BOTParser } from "./parsers/bot-parser";
import { ProductParser } from "./parsers/product-parser";
import { readFile, writeFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
const writeFileP = util.promisify(writeFile);
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export class LBDParser{

    // initialize the API
    public ifcApi = new WebIFC.IfcAPI();

    public async parseBOTTriples(ifcApi: WebIFC.IfcAPI, modelID: number){
        const botParser = new BOTParser(ifcApi, modelID);
        return await botParser.doParse();
    }

    public async parseProductTriples(ifcApi: WebIFC.IfcAPI, modelID: number){
        const productParser = new ProductParser(ifcApi, modelID);
        return await productParser.doParse();
    }

}

async function main(){

    console.log("Hello world");

    const argv = await yargs(hideBin(process.argv))
        .command('parse [file-path]', 'parse ifc', (yargs) => {
            return yargs
            .positional('file-path', {
                describe: 'path to IFC',
                type: 'string'
            })
        }, (argv) => {
            if (argv.verbose) console.info(`Parsing IFC :${argv["file-path"]}`)
            // serve(argv.port)
        })
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Run with verbose logging'
        })
        .parse();
    
    if(argv["file-path"] == undefined) return console.error("Please provide a file path");
    
    const filePath: string = argv["file-path"];

    // Init API and load model
    const ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    const fileData = await readFileP(filePath);
    const modelID = ifcApi.OpenModel(fileData);

    // Init LBD Parser and parse BOT
    const lbdParser = new LBDParser();
    const bot = await lbdParser.parseBOTTriples(ifcApi, modelID);

    // Close the model, all memory is freed
    ifcApi.CloseModel(modelID);

    // Serialize result
    const exportPath = "./bot.json";
    await writeFileP(exportPath, JSON.stringify(bot, null, "\t"), 'utf8');

}

main();