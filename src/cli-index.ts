#!/usr/bin/env node
import { LBDParser } from ".";
import { CLITool } from "./cli-tool";

async function main(){

    const cliTool = new CLITool();
    const argv = await cliTool.init();

    // Parse file
    const lbdParser = new LBDParser(argv.format);
    await cliTool.parseFile(lbdParser);

}

main();