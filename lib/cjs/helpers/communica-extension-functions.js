"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extensionFunctions = void 0;

var _rdfDataFactory = require("rdf-data-factory");

var _wktParser = require("./wkt-parser");

var DF = new _rdfDataFactory.DataFactory();
var extensionFunctions = {
  'http://example.org/functions#to-upper-case': function httpExampleOrgFunctionsToUpperCase(args) {
    var arg = args[0];

    if (arg.termType === 'Literal' && arg.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
      return DF.literal(arg.value.toUpperCase(), arg.datatype);
    }

    return arg;
  },
  'http://example.org/functions#get-id': function httpExampleOrgFunctionsGetId(args) {
    var arg = args[0];

    if (arg.termType === 'NamedNode') {
      return DF.literal(getID(arg));
    }

    return arg;
  },
  'http://example.org/functions#get-namespace': function httpExampleOrgFunctionsGetNamespace(args) {
    var arg = args[0];

    if (arg.termType === 'NamedNode') {
      return DF.literal(getNamespace(arg));
    }

    return arg;
  },
  'http://example.org/functions#uri-concat': function httpExampleOrgFunctionsUriConcat(args) {
    var uri1 = args[0];
    var uri2 = args[1];

    if (uri1.termType === 'NamedNode' && uri2.termType === 'NamedNode') {
      var ns = getNamespace(uri1);
      var id1 = getID(uri1);
      var id2 = getID(uri2);
      return DF.namedNode(ns + id1 + id2);
    }

    return DF.literal("ERROR");
  },
  // GEOJSON
  // geosf:distance(p1, p2, decimals)
  'http://www.opengis.net/def/function/geosparql/distance': function httpWwwOpengisNetDefFunctionGeosparqlDistance(args) {
    var decimals = args[2] != undefined ? parseFloat(args[2].value) : 8;

    if (args[0].termType === 'Literal' && args[1].termType === 'Literal') {
      var p1 = (0, _wktParser.parseWKT)(args[0].value);
      var p2 = (0, _wktParser.parseWKT)(args[1].value);
      var a = p1[0] - p2[0];
      var b = p1[1] - p2[1];
      var c = p1[2] - p2[2];
      var d = round(Math.sqrt(a * a + b * b + c * c), decimals); // if(p1.length == 2 && p2.length == 2){
      // } 

      return DF.literal(d.toString(), DF.namedNode('http://www.w3.org/2001/XMLSchema#decimal'));
    }

    return DF.literal("ERROR");
  }
};
exports.extensionFunctions = extensionFunctions;

function round(num) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.round(num * Math.pow(10, decimals) + Number.EPSILON) / Math.pow(10, decimals);
}

function getID(uri) {
  return uri.value.indexOf("#") != -1 ? uri.value.split("#")[1] : uri.value.split("/").pop();
}

function getNamespace(uri) {
  if (uri.value.indexOf("#") != -1) {
    return uri.value.split("#")[0] + "#";
  } else {
    var arr = uri.value.split("/");
    arr.pop();
    return arr.join("/") + "/";
  }
}
//# sourceMappingURL=communica-extension-functions.js.map