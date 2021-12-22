"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var readFileP = util.promisify(_fs.readFile);
var writeFileP = util.promisify(_fs.writeFile);
var supportedSubsets = ["bot", "fso", "products"];

var CLITool = /*#__PURE__*/function () {
  function CLITool() {
    _classCallCheck(this, CLITool);
  }

  _createClass(CLITool, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _yargs["default"])((0, _helpers.hideBin)(process.argv)).version(_package.version).command('[subset]', 'parse ifc', function (yargs) {
                  return yargs.positional('subset', {
                    describe: 'what information do you wish to extract?',
                    choices: supportedSubsets,
                    demandOption: true
                  });
                }, function (argv) {
                  if (argv.verbose) console.info("Parsing IFC :".concat(argv["file-path"])); // serve(argv.port)
                }).option('input-file', {
                  alias: 'i',
                  type: 'string',
                  description: 'Path to IFC',
                  demandOption: true
                }).option('output-file', {
                  alias: 'o',
                  type: 'string',
                  description: 'Path to resulting triples',
                  "default": './triples.json'
                }).option('format', {
                  alias: 'f',
                  type: 'string',
                  description: 'Output format',
                  choices: ["jsonld", "nquads"],
                  "default": 'jsonld'
                }).option('verbose', {
                  alias: 'v',
                  type: 'boolean',
                  description: 'Run with verbose logging'
                }).parse();

              case 2:
                this.argv = _context.sent;
                return _context.abrupt("return", this.argv);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "parseFile",
    value: function () {
      var _parseFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(lbdParser) {
        var subset, ifcApi, fileData, modelID, triples, fp, nquads;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.argv["input-file"] == undefined)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                this.argv["verbose"] && console.log("Running with verbose logging");
                subset = this.argv._[0].toLowerCase();

                if (!(supportedSubsets.indexOf(subset) == -1)) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", console.error("Unsupported subset option. Supported options are [".concat(supportedSubsets.map(function (s) {
                  return "\"".concat(s, "\"");
                }).join(", "), "]")));

              case 6:
                // Init API and load model
                ifcApi = new WebIFC.IfcAPI();
                _context2.next = 9;
                return ifcApi.Init();

              case 9:
                _context2.next = 11;
                return readFileP(this.argv.inputFile);

              case 11:
                fileData = _context2.sent;
                modelID = ifcApi.OpenModel(fileData); // Init LBD Parser and parse BOT

                if (!(subset == "bot")) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 16;
                return lbdParser.parseBOTTriples(ifcApi, modelID, this.argv["verbose"]);

              case 16:
                triples = _context2.sent;

              case 17:
                if (!(subset == "fso")) {
                  _context2.next = 21;
                  break;
                }

                _context2.next = 20;
                return lbdParser.parseFSOTriples(ifcApi, modelID, this.argv["verbose"]);

              case 20:
                triples = _context2.sent;

              case 21:
                if (!(subset == "products")) {
                  _context2.next = 25;
                  break;
                }

                _context2.next = 24;
                return lbdParser.parseProductTriples(ifcApi, modelID, this.argv["verbose"]);

              case 24:
                triples = _context2.sent;

              case 25:
                if (!(!triples || triples == undefined)) {
                  _context2.next = 27;
                  break;
                }

                return _context2.abrupt("return", console.log("Found nothing relevant in the file"));

              case 27:
                // Close the model, all memory is freed
                ifcApi.CloseModel(modelID); // Serialize result

                if (!(this.argv.format == "jsonld")) {
                  _context2.next = 31;
                  break;
                }

                _context2.next = 31;
                return writeFileP(this.argv.outputFile, JSON.stringify(triples, null, "\t"), 'utf8');

              case 31:
                if (!(this.argv.format == "nquads")) {
                  _context2.next = 36;
                  break;
                }

                fp = this.argv.outputFile.replace(".json", ".nq");
                nquads = typeof triples != "string" ? triples.toString() : triples;
                _context2.next = 36;
                return writeFileP(fp, nquads, 'utf8');

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parseFile(_x) {
        return _parseFile.apply(this, arguments);
      }

      return parseFile;
    }()
  }]);

  return CLITool;
}();

exports.CLITool = CLITool;
//# sourceMappingURL=cli-tool.js.map