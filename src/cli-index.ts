#!/usr/bin/env node
import { CLITool } from "./cli-tool";

async function main(){

    const cliTool = new CLITool();
    const argv = await cliTool.init();

    // Parse file
    await cliTool.parseFile();

}

main();