"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = void 0;

var _BaseDefinitions = require("../helpers/BaseDefinitions");

var _jsonld = require("jsonld");

class Parser {
  jsonLDObject = {
    "@context": {
      "bot": "https://w3id.org/bot#",
      "fso": "https://w3id.org/fso#",
      "omg": "https://w3id.org/omg#",
      "fog": "https://w3id.org/fog#",
      "ex": "https://example.com/",
      "ifc": "http://ifcowl.openbimstandards.org/IFC2X3_Final#",
      "inst": "https://example.com/"
    },
    "@graph": []
  };

  constructor(ifcAPI, modelID, format = _BaseDefinitions.SerializationFormat.JSONLD, verbose = false) {
    this.modelID = modelID;
    this.ifcAPI = ifcAPI;
    this.verbose = verbose;
    this.format = format;
  }

  async getTriples() {
    if (this.format == _BaseDefinitions.SerializationFormat.JSONLD) return this.getJSONLD();
    if (this.format == _BaseDefinitions.SerializationFormat.NQuads) return this.getNQuads();
    return "";
  }

  async getTripleCount() {
    const rdf = await (0, _jsonld.toRDF)(this.jsonLDObject);
    const tripleCount = rdf.length;
    return tripleCount;
  }

  getJSONLD() {
    return this.jsonLDObject;
  }

  async getNQuads() {
    return await (0, _jsonld.toRDF)(this.jsonLDObject, {
      format: 'application/n-quads'
    });
  }

}

exports.Parser = Parser;
//# sourceMappingURL=parser.js.map