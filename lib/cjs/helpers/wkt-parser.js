"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWKT = parseWKT;

function parseWKT(wktString) {
  wktString = wktString.toLocaleLowerCase();

  if (wktString.startsWith("point")) {
    console.log("Handle point");
    return parsePoint(wktString);
  }
}

function parsePoint(wktString) {
  var point = wktString.split("(")[1].split(")")[0].trim(); // Ex ["0 0 0"]

  var floatPoint = point.split(" ").map(function (p) {
    return parseFloat(p);
  });
  console.log(floatPoint);
}
//# sourceMappingURL=wkt-parser.js.map