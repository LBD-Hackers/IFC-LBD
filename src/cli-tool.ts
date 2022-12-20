import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {version} from '../package.json';
import { readFile, writeFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
const writeFileP = util.promisify(writeFile);
import { IfcAPI } from "web-ifc";
import { LBDParser } from '.';
import { JSONLD } from './helpers/BaseDefinitions';
import { gzip } from "node-gzip";

const supportedSubsets = ["bot", "fso", "products", "properties", "tso"];

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

        const subset: string = this.argv._[0].toLowerCase();
        if(supportedSubsets.indexOf(subset) == -1){
            return console.error(`Unsupported subset option. Supported options are [${supportedSubsets.map(s => `"${s}"`).join(", ")}]`)
        }

        // Init API and load model
        this.argv["verbose"] && console.log("#".repeat(21 + subset.length));
        this.argv["verbose"] && console.log(`# IFC-LBD <${subset.toLocaleUpperCase()}> parser #`);
        this.argv["verbose"] && console.log("#".repeat(21 + subset.length));
        this.argv["verbose"] && console.log("");
        this.argv["verbose"] && console.time("Initilized API and loaded model");
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const fileData = await readFileP(this.argv.inputFile);
        const modelID = ifcApi.OpenModel(fileData);
        this.argv["verbose"] && console.timeEnd("Initilized API and loaded model");
        this.argv["verbose"] && console.log("");

        // Init LBD Parser and parse triples
        const triples = await this.parseTriples(lbdParser, ifcApi, subset, modelID);
        if(!triples || triples == undefined) return console.log("Found nothing relevant in the file");

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Serialize result
        await this.serialize(triples);

    }

    private async parseTriples(lbdParser: LBDParser, ifcApi: IfcAPI, subset: string, modelID: number = 0): Promise<JSONLD>{
        let triples;
        if(subset == "bot") triples = await lbdParser.parseBOTTriples(ifcApi, modelID, this.argv["verbose"]);
        if(subset == "fso") triples = await lbdParser.parseFSOTriples(ifcApi, modelID, this.argv["verbose"]);
        if(subset == "products") triples = await lbdParser.parseProductTriples(ifcApi, modelID, this.argv["verbose"]);
        if(subset == "properties") triples = await lbdParser.parsePropertyTriples(ifcApi, modelID, this.argv["verbose"]);
        if(subset == "tso") triples = await lbdParser.parseTSOTriples(ifcApi, modelID, this.argv["verbose"]);

        return triples;
    }

    private async serialize(triples: JSONLD): Promise<void>{

        if(this.argv.format == "jsonld"){
            this.argv["verbose"] && console.time("Serialized JSON-LD");
            await writeFileP(this.argv.outputFile, JSON.stringify(triples, null, "\t"), 'utf8');
            this.argv["verbose"] && console.timeEnd("Serialized JSON-LD");
        }
        if(this.argv.format == "nquads"){
            this.argv["verbose"] && console.time("Serialized NQuads");
            const fp = this.argv.outputFile.replace(".json", ".nq.gz");
            const nquads: string = typeof triples != "string" ? triples.toString() : triples;
            const zipped: Buffer = await gzip(nquads);
            await writeFileP(fp, zipped, 'utf8');
            this.argv["verbose"] && console.timeEnd("Serialized NQuads");
        }

    }

}