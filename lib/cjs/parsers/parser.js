"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
      "@context": _prefixes.prefixes,
      "@graph": []
    });

    _defineProperty(this, "communicaEngine", (0, _actorInitSparqlRdfjs.newEngine)());

    _defineProperty(this, "store", new N3.Store());

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
    key: "loadInStore",
    value: function () {
      var _loadInStore = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var quads;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _jsonld.toRDF)(this.jsonLDObject);

              case 2:
                quads = _context3.sent;
                _context3.next = 5;
                return this.store.addQuads(quads);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function loadInStore() {
        return _loadInStore.apply(this, arguments);
      }

      return loadInStore;
    }()
  }, {
    key: "executeUpdateQuery",
    value: function () {
      var _executeUpdateQuery = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(query) {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.communicaEngine.query(query, {
                  sources: [this.store],
                  extensionFunctions: _communicaExtensionFunctions.extensionFunctions
                });

              case 2:
                result = _context4.sent;
                _context4.next = 5;
                return result.updateResult;

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function executeUpdateQuery(_x) {
        return _executeUpdateQuery.apply(this, arguments);
      }

      return executeUpdateQuery;
    }()
  }, {
    key: "executeSelectQuery",
    value: function () {
      var _executeSelectQuery = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(query) {
        var result, _yield$this$communica, data;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.communicaEngine.query(query, {
                  sources: [this.store],
                  extensionFunctions: _communicaExtensionFunctions.extensionFunctions
                });

              case 2:
                result = _context5.sent;
                _context5.next = 5;
                return this.communicaEngine.resultToString(result, 'application/sparql-results+json');

              case 5:
                _yield$this$communica = _context5.sent;
                data = _yield$this$communica.data;
                data.pipe(process.stdout); // Print to standard output

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function executeSelectQuery(_x2) {
        return _executeSelectQuery.apply(this, arguments);
      }

      return executeSelectQuery;
    }()
  }, {
    key: "getStoreSize",
    value: function getStoreSize() {
      return this.store.size;
    }
  }, {
    key: "getJSONLD",
    value: function () {
      var _getJSONLD = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var nquads, doc, compacted;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(this.store.size > 0)) {
                  _context6.next = 9;
                  break;
                }

                nquads = this.store.getQuads(null, null, null, null);
                _context6.next = 4;
                return (0, _jsonld.fromRDF)(nquads);

              case 4:
                doc = _context6.sent;
                _context6.next = 7;
                return (0, _jsonld.compact)(doc, this.jsonLDObject["@context"]);

              case 7:
                compacted = _context6.sent;
                return _context6.abrupt("return", compacted);

              case 9:
                return _context6.abrupt("return", this.jsonLDObject);

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getJSONLD() {
        return _getJSONLD.apply(this, arguments);
      }

      return getJSONLD;
    }()
  }, {
    key: "getNQuads",
    value: function () {
      var _getNQuads = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // If store is up, serialize the content of the store
                if (this.store.size > 0) {} // If not, simply convert the JSON-LD object


                _context7.next = 3;
                return (0, _jsonld.toRDF)(this.jsonLDObject, {
                  format: 'application/n-quads'
                });

              case 3:
                return _context7.abrupt("return", _context7.sent);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getNQuads() {
        return _getNQuads.apply(this, arguments);
      }

      return getNQuads;
    }()
  }, {
    key: "serializeStoreContent",
    value: function () {
      var _serializeStoreContent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var _this = this;

        var format,
            _args8 = arguments;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                format = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : _BaseDefinitions.N3Format.Turtle;
                return _context8.abrupt("return", new Promise(function (resolve, reject) {
                  var writer = new N3.Writer({
                    prefixes: _prefixes.prefixes,
                    format: format
                  });

                  var quads = _this.store.getQuads(null, null, null, null);

                  for (var i = 0; i < quads.length; i++) {
                    writer.addQuad(quads[i]);
                  }

                  writer.end(function (error, result) {
                    if (error) reject(error);
                    resolve(result);
                  });
                }));

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function serializeStoreContent() {
        return _serializeStoreContent.apply(this, arguments);
      }

      return serializeStoreContent;
    }()
  }]);

  return Parser;
}();

exports.Parser = Parser;
//# sourceMappingURL=parser.js.map