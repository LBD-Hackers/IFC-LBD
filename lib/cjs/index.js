"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LBDParser = void 0;

var WebIFC = _interopRequireWildcard(require("web-ifc/web-ifc-api"));

var _botParser = require("./parsers/bot-parser");

var _productParser = require("./parsers/product-parser");

var _BaseDefinitions = require("./helpers/BaseDefinitions");

var _fsoParser = require("./parsers/fso-parser");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LBDParser = /*#__PURE__*/function () {
  // initialize the API
  function LBDParser() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _BaseDefinitions.SerializationFormat.JSONLD;

    _classCallCheck(this, LBDParser);

    _defineProperty(this, "ifcApi", new WebIFC.IfcAPI());

    this.format = format;
  }

  _createClass(LBDParser, [{
    key: "setWasmPath",
    value: function setWasmPath(path) {
      this.ifcApi.SetWasmPath(path);
    }
  }, {
    key: "parseBOTTriples",
    value: function () {
      var _parseBOTTriples = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ifcApi, modelID) {
        var verbose,
            botParser,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                verbose = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
                botParser = new _botParser.BOTParser(ifcApi, modelID, this.format, verbose);
                _context.next = 4;
                return botParser.doParse();

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parseBOTTriples(_x, _x2) {
        return _parseBOTTriples.apply(this, arguments);
      }

      return parseBOTTriples;
    }()
  }, {
    key: "parseProductTriples",
    value: function () {
      var _parseProductTriples = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ifcApi, modelID) {
        var verbose,
            productParser,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                verbose = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : false;
                productParser = new _productParser.ProductParser(ifcApi, modelID, this.format, verbose);
                _context2.next = 4;
                return productParser.doParse();

              case 4:
                return _context2.abrupt("return", _context2.sent);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parseProductTriples(_x3, _x4) {
        return _parseProductTriples.apply(this, arguments);
      }

      return parseProductTriples;
    }()
  }, {
    key: "parseFSOTriples",
    value: function () {
      var _parseFSOTriples = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ifcApi, modelID) {
        var verbose,
            fsoParser,
            _args3 = arguments;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                verbose = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
                fsoParser = new _fsoParser.FSOParser(ifcApi, modelID, this.format, verbose);
                _context3.next = 4;
                return fsoParser.doParse();

              case 4:
                return _context3.abrupt("return", _context3.sent);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseFSOTriples(_x5, _x6) {
        return _parseFSOTriples.apply(this, arguments);
      }

      return parseFSOTriples;
    }()
  }]);

  return LBDParser;
}();

exports.LBDParser = LBDParser;
//# sourceMappingURL=index.js.map