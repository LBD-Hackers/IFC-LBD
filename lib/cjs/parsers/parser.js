"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = void 0;

var _BaseDefinitions = require("../helpers/BaseDefinitions");

var _jsonld = require("jsonld");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Parser = /*#__PURE__*/function () {
  function Parser(ifcAPI, modelID) {
    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _BaseDefinitions.SerializationFormat.JSONLD;
    var verbose = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, Parser);

    _defineProperty(this, "jsonLDObject", {
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
    });

    this.modelID = modelID;
    this.ifcAPI = ifcAPI;
    this.verbose = verbose;
    this.format = format;
  }

  _createClass(Parser, [{
    key: "getTriples",
    value: function () {
      var _getTriples = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.format == _BaseDefinitions.SerializationFormat.JSONLD)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", this.getJSONLD());

              case 2:
                if (!(this.format == _BaseDefinitions.SerializationFormat.NQuads)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return", this.getNQuads());

              case 4:
                return _context.abrupt("return", "");

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTriples() {
        return _getTriples.apply(this, arguments);
      }

      return getTriples;
    }()
  }, {
    key: "getTripleCount",
    value: function () {
      var _getTripleCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var rdf, tripleCount;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _jsonld.toRDF)(this.jsonLDObject);

              case 2:
                rdf = _context2.sent;
                tripleCount = rdf.length;
                return _context2.abrupt("return", tripleCount);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTripleCount() {
        return _getTripleCount.apply(this, arguments);
      }

      return getTripleCount;
    }()
  }, {
    key: "getJSONLD",
    value: function getJSONLD() {
      return this.jsonLDObject;
    }
  }, {
    key: "getNQuads",
    value: function () {
      var _getNQuads = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _jsonld.toRDF)(this.jsonLDObject, {
                  format: 'application/n-quads'
                });

              case 2:
                return _context3.abrupt("return", _context3.sent);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getNQuads() {
        return _getNQuads.apply(this, arguments);
      }

      return getNQuads;
    }()
  }]);

  return Parser;
}();

exports.Parser = Parser;
//# sourceMappingURL=parser.js.map