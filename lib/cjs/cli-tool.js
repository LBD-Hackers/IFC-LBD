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

var _nodeGzip = require("node-gzip");

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
var supportedSubsets = ["bot", "fso", "products", "properties", "tso"];

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
        var subset, ifcApi, fileData, modelID, triples;
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
                this.argv["verbose"] && console.log("#".repeat(21 + subset.length));
                this.argv["verbose"] && console.log("# IFC-LBD <".concat(subset.toLocaleUpperCase(), "> parser #"));
                this.argv["verbose"] && console.log("#".repeat(21 + subset.length));
                this.argv["verbose"] && console.log("");
                this.argv["verbose"] && console.time("Initilized API and loaded model");
                ifcApi = new WebIFC.IfcAPI();
                _context2.next = 14;
                return ifcApi.Init();

              case 14:
                _context2.next = 16;
                return readFileP(this.argv.inputFile);

              case 16:
                fileData = _context2.sent;
                modelID = ifcApi.OpenModel(fileData);
                this.argv["verbose"] && console.timeEnd("Initilized API and loaded model");
                this.argv["verbose"] && console.log(""); // Init LBD Parser and parse triples

                _context2.next = 22;
                return this.parseTriples(lbdParser, ifcApi, subset, modelID);

              case 22:
                triples = _context2.sent;

                if (!(!triples || triples == undefined)) {
                  _context2.next = 25;
                  break;
                }

                return _context2.abrupt("return", console.log("Found nothing relevant in the file"));

              case 25:
                // Close the model, all memory is freed
                ifcApi.CloseModel(modelID); // Serialize result

                _context2.next = 28;
                return this.serialize(triples);

              case 28:
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
  }, {
    key: "parseTriples",
    value: function () {
      var _parseTriples = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(lbdParser, ifcApi, subset) {
        var modelID,
            triples,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                modelID = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 0;

                if (!(subset == "bot")) {
                  _context3.next = 5;
                  break;
                }

                _context3.next = 4;
                return lbdParser.parseBOTTriples(ifcApi, modelID, this.argv["verbose"]);

              case 4:
                triples = _context3.sent;

              case 5:
                if (!(subset == "fso")) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 8;
                return lbdParser.parseFSOTriples(ifcApi, modelID, this.argv["verbose"]);

              case 8:
                triples = _context3.sent;

              case 9:
                if (!(subset == "products")) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 12;
                return lbdParser.parseProductTriples(ifcApi, modelID, this.argv["verbose"]);

              case 12:
                triples = _context3.sent;

              case 13:
                if (!(subset == "properties")) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 16;
                return lbdParser.parsePropertyTriples(ifcApi, modelID, this.argv["verbose"]);

              case 16:
                triples = _context3.sent;

              case 17:
                if (!(subset == "tso")) {
                  _context3.next = 21;
                  break;
                }

                _context3.next = 20;
                return lbdParser.parseTSOTriples(ifcApi, modelID, this.argv["verbose"]);

              case 20:
                triples = _context3.sent;

              case 21:
                return _context3.abrupt("return", triples);

              case 22:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseTriples(_x2, _x3, _x4) {
        return _parseTriples.apply(this, arguments);
      }

      return parseTriples;
    }()
  }, {
    key: "serialize",
    value: function () {
      var _serialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(triples) {
        var fp, nquads, zipped;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.argv.format == "jsonld")) {
                  _context4.next = 5;
                  break;
                }

                this.argv["verbose"] && console.time("Serialized JSON-LD");
                _context4.next = 4;
                return writeFileP(this.argv.outputFile, JSON.stringify(triples, null, "\t"), 'utf8');

              case 4:
                this.argv["verbose"] && console.timeEnd("Serialized JSON-LD");

              case 5:
                if (!(this.argv.format == "nquads")) {
                  _context4.next = 15;
                  break;
                }

                this.argv["verbose"] && console.time("Serialized NQuads");
                fp = this.argv.outputFile.replace(".json", ".nq.gz");
                nquads = typeof triples != "string" ? triples.toString() : triples;
                _context4.next = 11;
                return (0, _nodeGzip.gzip)(nquads);

              case 11:
                zipped = _context4.sent;
                _context4.next = 14;
                return writeFileP(fp, zipped, 'utf8');

              case 14:
                this.argv["verbose"] && console.timeEnd("Serialized NQuads");

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function serialize(_x5) {
        return _serialize.apply(this, arguments);
      }

      return serialize;
    }()
  }]);

  return CLITool;
}();

exports.CLITool = CLITool;
//# sourceMappingURL=cli-tool.js.map