"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LBDParser = void 0;

var WebIFC = _interopRequireWildcard(require("web-ifc/web-ifc-api"));

var _botParser = require("./parsers/bot-parser");

var _productParser = require("./parsers/product-parser");

var _BaseDefinitions = require("./helpers/BaseDefinitions");

var _fsoParser = require("./parsers/fso-parser");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class LBDParser {
  // initialize the API
  ifcApi = new WebIFC.IfcAPI();

  constructor(format = _BaseDefinitions.SerializationFormat.JSONLD) {
    this.format = format;
  }

  setWasmPath(path) {
    this.ifcApi.SetWasmPath(path);
  }

  async parseBOTTriples(ifcApi, modelID, verbose = false) {
    const botParser = new _botParser.BOTParser(ifcApi, modelID, this.format, verbose);
    return await botParser.doParse();
  }

  async parseProductTriples(ifcApi, modelID, verbose = false) {
    const productParser = new _productParser.ProductParser(ifcApi, modelID, this.format, verbose);
    return await productParser.doParse();
  }

  async parseFSOTriples(ifcApi, modelID, verbose = false) {
    const fsoParser = new _fsoParser.FSOParser(ifcApi, modelID, this.format, verbose);
    return await fsoParser.doParse();
  }

}

exports.LBDParser = LBDParser;
//# sourceMappingURL=index.js.map