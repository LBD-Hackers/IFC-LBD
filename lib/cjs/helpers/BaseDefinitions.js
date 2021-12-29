"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SerializationFormat = exports.N3Format = exports.Mimetype = void 0;
var SerializationFormat;
exports.SerializationFormat = SerializationFormat;

(function (SerializationFormat) {
  SerializationFormat["NQuads"] = "nquads";
  SerializationFormat["JSONLD"] = "jsonld";
})(SerializationFormat || (exports.SerializationFormat = SerializationFormat = {}));

var Mimetype;
exports.Mimetype = Mimetype;

(function (Mimetype) {
  Mimetype["NTriples"] = "application/n-triples";
  Mimetype["Turtle"] = "text/turtle";
  Mimetype["NQuads"] = "application/n-quads";
  Mimetype["Trig"] = "application/trig";
  Mimetype["SPARQLJSON"] = "application/sparql-results+json";
  Mimetype["JSONLD"] = "application/ld+json";
  Mimetype["DLOG"] = "application/x.datalog";
})(Mimetype || (exports.Mimetype = Mimetype = {}));

var N3Format;
exports.N3Format = N3Format;

(function (N3Format) {
  N3Format["NTriples"] = "N-Triples";
  N3Format["Trig"] = "application/trig";
  N3Format["NQuads"] = "N-Quads";
  N3Format["Turtle"] = "Turtle";
})(N3Format || (exports.N3Format = N3Format = {}));
//# sourceMappingURL=BaseDefinitions.js.map