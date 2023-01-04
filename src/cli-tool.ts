import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import {version} from '../package.json';
import { readFile, writeFile } from "fs";
import * as util from "util";
const readFileP = util.promisify(readFile);
const writeFileP = util.promisify(writeFile);
import { IfcAPI } from "web-ifc";
import { LBDParser } from '.';
import { JSONLD, ParserSettings, SerializationFormat } from './helpers/BaseDefinitions';
import { gzip } from "node-gzip";

export class CLITool{

    public supportedSubsets = ["bot", "fso", "products", "properties", "all"];

    public async getArgs(): Promise<any>{

        return await yargs(hideBin(process.argv))
            .version("0.3.1")
            .command('[subset]', 'parse ifc', (yargs) => {
                return yargs
                .positional('subset', {
                    describe: 'what information do you wish to extract?',
                    choices: this.supportedSubsets,
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

    }

    public async parseFile(inputFilePath: string, outputFilePath: string, settings: ParserSettings){

        const lbdParser = new LBDParser(settings);

        settings.verbose && console.log("Running with verbose logging");

        // Init API and load model
        settings.verbose && console.log("");
        settings.verbose && console.time("Initilized API and loaded model");
        const ifcApi = new IfcAPI();
        await ifcApi.Init();
        const fileData = await readFileP(inputFilePath);
        const modelID = ifcApi.OpenModel(fileData);
        settings.verbose && console.timeEnd("Initilized API and loaded model");
        settings.verbose && console.log("");

        // Init LBD Parser and parse triples
        const triples = await lbdParser.parse(ifcApi, modelID);
        if(!triples || triples == undefined) return console.log("Found nothing relevant in the file");

        // Close the model, all memory is freed
        ifcApi.CloseModel(modelID);

        // Serialize result
        await this.serialize(triples, outputFilePath, settings);

    }

    private async serialize(triples: JSONLD|string, outputFilePath: string, settings: ParserSettings): Promise<void>{

        if(settings.outputFormat == SerializationFormat.JSONLD){
            settings.verbose && console.time("Serialized JSON-LD");
            await writeFileP(outputFilePath, JSON.stringify(triples, null, "\t"), 'utf8');
            settings.verbose && console.timeEnd("Serialized JSON-LD");
        }
        if(settings.outputFormat == SerializationFormat.NQuads){
            settings.verbose && console.time("Serialized NQuads");
            const fp = outputFilePath.replace(".json", ".nq.gz");
            const nquads: string = typeof triples != "string" ? triples.toString() : triples;
            const zipped: Buffer = await gzip(nquads);
            await writeFileP(fp, zipped, 'utf8');
            settings.verbose && console.timeEnd("Serialized NQuads");
        }

    }

}