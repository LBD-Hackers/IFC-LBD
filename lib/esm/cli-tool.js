"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLITool = void 0;

var _yargs = _interopRequireDefault(require("yargs"));

var _helpers = require("yargs/helpers");

var _package = require("../package.json");

var _fs = require("fs");

var util = _interopRequireWildcard(require("util"));

var WebIFC = _interopRequireWildcard(require("web-ifc/web-ifc-api"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFileP = util.promisify(_fs.readFile);
const writeFileP = util.promisify(_fs.writeFile);
const supportedSubsets = ["bot", "fso", "products"];

class CLITool {
  async init() {
    this.argv = await (0, _yargs.default)((0, _helpers.hideBin)(process.argv)).version(_package.version).command('[subset]', 'parse ifc', yargs => {
      return yargs.positional('subset', {
        describe: 'what information do you wish to extract?',
        choices: supportedSubsets,
        demandOption: true
      });
    }, argv => {
      if (argv.verbose) console.info(`Parsing IFC :${argv["file-path"]}`); // serve(argv.port)
    }).option('input-file', {
      alias: 'i',
      type: 'string',
      description: 'Path to IFC',
      demandOption: true
    }).option('output-file', {
      alias: 'o',
      type: 'string',
      description: 'Path to resulting triples',
      default: './triples.json'
    }).option('format', {
      alias: 'f',
      type: 'string',
      description: 'Output format',
      choices: ["jsonld", "nquads"],
      default: 'jsonld'
    }).option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    }).parse();
    return this.argv;
  }

  async parseFile(lbdParser) {
    if (this.argv["input-file"] == undefined) return;
    this.argv["verbose"] && console.log("Running with verbose logging");

    const subset = this.argv._[0].toLowerCase();

    if (supportedSubsets.indexOf(subset) == -1) {
      return console.error(`Unsupported subset option. Supported options are [${supportedSubsets.map(s => `"${s}"`).join(", ")}]`);
    } // Init API and load model


    const ifcApi = new WebIFC.IfcAPI();
    await ifcApi.Init();
    const fileData = await readFileP(this.argv.inputFile);
    const modelID = ifcApi.OpenModel(fileData); // Init LBD Parser and parse BOT

    let triples;
    if (subset == "bot") triples = await lbdParser.parseBOTTriples(ifcApi, modelID, this.argv["verbose"]);
    if (subset == "fso") triples = await lbdParser.parseFSOTriples(ifcApi, modelID, this.argv["verbose"]);
    if (subset == "products") triples = await lbdParser.parseProductTriples(ifcApi, modelID, this.argv["verbose"]);
    if (!triples || triples == undefined) return console.log("Found nothing relevant in the file"); // Close the model, all memory is freed

    ifcApi.CloseModel(modelID); // Serialize result

    if (this.argv.format == "jsonld") {
      await writeFileP(this.argv.outputFile, JSON.stringify(triples, null, "\t"), 'utf8');
    }

    if (this.argv.format == "nquads") {
      const fp = this.argv.outputFile.replace(".json", ".nq");
      const nquads = typeof triples != "string" ? triples.toString() : triples;
      await writeFileP(fp, nquads, 'utf8');
    }
  }

}

exports.CLITool = CLITool;
//# sourceMappingURL=cli-tool.js.map