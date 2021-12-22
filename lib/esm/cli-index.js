#!/usr/bin/env node
"use strict";

var _ = require(".");

var _cliTool = require("./cli-tool");

async function main() {
  const cliTool = new _cliTool.CLITool();
  const argv = await cliTool.init(); // Parse file

  const lbdParser = new _.LBDParser(argv.format);
  await cliTool.parseFile(lbdParser);
}

main();
//# sourceMappingURL=cli-index.js.map