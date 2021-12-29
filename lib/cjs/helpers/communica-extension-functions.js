"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extensionFunctions = void 0;

var _rdfDataFactory = require("rdf-data-factory");

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
  }
};
exports.extensionFunctions = extensionFunctions;

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