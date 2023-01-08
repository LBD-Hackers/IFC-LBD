#!/usr/bin/env node
import { LBDParser } from ".";
import { CLITool } from "./cli-tool";
import { ParserSettings } from "./helpers/BaseDefinitions";

async function main(){

    const cliTool = new CLITool();
    const args = await cliTool.getArgs();

    // Get file
    const inputFilePath = args["input-file"];
    const outputFilePath = args.outputFile

    // Get subset
    const subset: string = args._[0].toLowerCase();
    if(cliTool.supportedSubsets.indexOf(subset) == -1){
        return console.error(`Unsupported subset option. Supported options are [${cliTool.supportedSubsets.map(s => `"${s}"`).join(", ")}]`)
    }

    // Define settings
    const settings = new ParserSettings();
    settings.outputFormat = args.format;
    settings.verbose = args.verbose;
    if(subset == "all"){
        settings.subsets.BOT = true;
        settings.subsets.PRODUCTS = true;
        settings.subsets.PROPERTIES = true;
        settings.subsets.FSO = true;
    }else{
        settings.subsets.BOT = subset == "bot";
        settings.subsets.FSO = subset == "fso";
        settings.subsets.PRODUCTS = subset == "products";
        settings.subsets.PROPERTIES = subset == "properties";
    }

    settings.verbose && console.log("#".repeat(21 + subset.length));
    settings.verbose && console.log(`# IFC-LBD <${subset.toLocaleUpperCase()}> parser #`);
    settings.verbose && console.log("#".repeat(21 + subset.length));
    
    // Parse file
    await cliTool.parseFile(inputFilePath, outputFilePath, settings, args["zip"]);

}

main();