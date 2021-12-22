"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultURIBuilder = defaultURIBuilder;
exports.relativeURIBuilder = relativeURIBuilder;

function defaultURIBuilder(globalId) {
  return "inst:".concat(encodeURIComponent(globalId));
}

function relativeURIBuilder(globalId) {
  return "#".concat(encodeURIComponent(globalId));
}
//# sourceMappingURL=uri-builder.js.map