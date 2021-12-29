"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = void 0;

var _BaseDefinitions = require("../helpers/BaseDefinitions");

var _prefixes = require("../helpers/prefixes");

var _communicaExtensionFunctions = require("../helpers/communica-extension-functions");

var _jsonld = require("jsonld");

var N3 = _interopRequireWildcard(require("n3"));

var _actorInitSparqlRdfjs = require("@comunica/actor-init-sparql-rdfjs");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Parser {
  jsonLDObject = {
    "@context": _prefixes.prefixes,
    "@graph": []
  };
  communicaEngine = (0, _actorInitSparqlRdfjs.newEngine)();
  store = new N3.Store();

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

  async loadInStore() {
    const quads = await (0, _jsonld.toRDF)(this.jsonLDObject);
    await this.store.addQuads(quads);
  }

  async executeUpdateQuery(query) {
    // Initiate the update
    const result = await this.communicaEngine.query(query, {
      sources: [this.store],
      extensionFunctions: _communicaExtensionFunctions.extensionFunctions
    }); // Wait for the update to complete

    await result.updateResult;
  }

  async executeSelectQuery(query) {
    // Initiate the update
    const result = await this.communicaEngine.query(query, {
      sources: [this.store],
      extensionFunctions: _communicaExtensionFunctions.extensionFunctions
    });
    const {
      data
    } = await this.communicaEngine.resultToString(result, 'application/sparql-results+json');
    data.pipe(process.stdout); // Print to standard output
  }

  getStoreSize() {
    return this.store.size;
  }

  async getJSONLD() {
    // If store is up, serialize the content of the store
    if (this.store.size > 0) {
      const nquads = this.store.getQuads(null, null, null, null);
      const doc = await (0, _jsonld.fromRDF)(nquads);
      const compacted = await (0, _jsonld.compact)(doc, this.jsonLDObject["@context"]);
      return compacted;
    } // If not, simply return the JSON-LD object


    return this.jsonLDObject;
  }

  async getNQuads() {
    // If store is up, serialize the content of the store
    if (this.store.size > 0) {} // If not, simply convert the JSON-LD object


    return await (0, _jsonld.toRDF)(this.jsonLDObject, {
      format: 'application/n-quads'
    });
  }

  async serializeStoreContent(format = _BaseDefinitions.N3Format.Turtle) {
    return new Promise((resolve, reject) => {
      const writer = new N3.Writer({
        prefixes: _prefixes.prefixes,
        format
      });
      const quads = this.store.getQuads(null, null, null, null);

      for (let i = 0; i < quads.length; i++) {
        writer.addQuad(quads[i]);
      }

      writer.end((error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

}

exports.Parser = Parser;
//# sourceMappingURL=parser.js.map