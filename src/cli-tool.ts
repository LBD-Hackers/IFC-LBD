import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {version} from '../package.json';
import { readFile, writeFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
const writeFileP = util.promisify(writeFile);
import * as WebIFC from "web-ifc/web-ifc-api";
import { LBDParser } from '.';

const supportedSubsets = ["bot", "fso", "products"];

export class CLITool{

    public argv: any;

    public async init(){

        this.argv = await yargs(hideBin(process.argv))
            .version(version)   
            .command('[subset]', 'parse ifc', (yargs) => {
                return yargs
                .positional('subset', {
                    describe: 'what information do you wish to extract?',
                    choices: supportedSubsets,
                    demandOption: true
                })
            }, (argv) => {
                if (argv.verbose) console.info(`Parsing IFC :${argv["file-path"]}`)
                // serve(argv.port)
            })
            .option('input-file', {
                alias: 'i',
                type: 'string',
                description: 'Path to IFC',
                demandOption: true
            })
            .option('output-file', {
                alias: 'o',
                type: 'string',
                description: 'Path to resulting triples',
                default: './triples.json'
            })
            .option('format', {
                alias: 'f',
                type: 'string',
                description: 'Output format',
                choices: ["jsonld", "nquads"],
                default: 'jsonld'
            })
            .option('verbose', {
                alias: 'v',
                type: 'boolean',
                description: 'Run with verbose logging'
            })
            .parse();
    
        return this.argv;

    }

    public async parseFile(lbdParser: LBDParser){
        
        if(this.argv["input-file"] == undefined) return;

        this.argv["verbose"] && console.log("Running with verbose logging");

        const subset = this.argv._[0].toLowerCase();
        if(supportedSubsets.indexOf(subset) == -1){
            return console.error(`Unsupported subset option. Supported options are [${supportedSubsets.map(s => `"${s}"`).join(", ")}]`)
        }

        // Init API and load model
        const ifcApi = new WebIFC.IfcAPI();
        await ifcApi.Init();
        const fileData = await readFileP(this.argv.inputFile);
        const modelID = ifcApi.OpenModel(fileData);

        // Init LBD Parser and parse BOT
        let triples;
        if(subset == "bot") triples = await lbdParser.parseBOTTriples(ifcApi, modelID, this.argv["verbose"]);
        if(subset == "fso") triples = await lbdParser.parseFSOTriples(ifcApi, modelID, this.argv["verbose"]);
        if(subset == "products") triples = await lbdParser.parseProductTriples(ifcApi, modelID, this.argv["verbose"]);

        if(!triples || triples == undefined) return console.log("Found nothing relevant in the file");

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Serialize result
        if(this.argv.format == "jsonld"){
            await writeFileP(this.argv.outputFile, JSON.stringify(triples, null, "\t"), 'utf8');
        }
        if(this.argv.format == "nquads"){
            const fp = this.argv.outputFile.replace(".json", ".nq");
            const nquads: string = typeof triples != "string" ? triples.toString() : triples;
            await writeFileP(fp, nquads, 'utf8');
        }

    }

}