"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductParser = void 0;

var _webIfc = require("web-ifc");

var _parser = require("./parser");

var _uriBuilder = require("../helpers/uri-builder");

var _IfcElementsMap = require("../helpers/IfcElementsMap");

var _itemSearch = require("../helpers/item-search");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } Object.defineProperty(subClass, "prototype", { value: Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }), writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ProductParser = /*#__PURE__*/function (_Parser) {
  _inherits(ProductParser, _Parser);

  var _super = _createSuper(ProductParser);

  function ProductParser() {
    _classCallCheck(this, ProductParser);

    return _super.apply(this, arguments);
  }

  _createClass(ProductParser, [{
    key: "doParse",
    value: function () {
      var _doParse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var tripleCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.verbose && console.log("Started PRODUCTS parsing");
                this.verbose && console.log("");
                console.time("Finished products parsing");
                this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
                this.verbose && console.time("1/1: Finding products");
                _context.next = 7;
                return this.buildProducts();

              case 7:
                this.jsonLDObject["@graph"] = _context.sent;
                this.verbose && console.timeEnd("1/1: Finding products");
                this.verbose && console.log("");
                console.timeEnd("Finished products parsing");

                if (!this.verbose) {
                  _context.next = 16;
                  break;
                }

                _context.next = 14;
                return this.getTripleCount();

              case 14:
                tripleCount = _context.sent;
                console.log("Total triples: " + tripleCount);

              case 16:
                _context.next = 18;
                return this.getTriples();

              case 18:
                return _context.abrupt("return", _context.sent);

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function doParse() {
        return _doParse.apply(this, arguments);
      }

      return doParse;
    }()
  }, {
    key: "buildProducts",
    value: function () {
      var _buildProducts = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var graph, skippedTypes, subTypes, expressIDArray, _iterator, _step, typeId, i, expressID, _yield$this$ifcAPI$pr, type, GlobalId, URI;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                graph = [];
                skippedTypes = [_webIfc.IFCOPENINGELEMENT]; // Get all subTypes of IfcElement

                subTypes = (0, _itemSearch.getItemSubtypes)(_webIfc.IFCELEMENT).filter(function (typeID) {
                  return skippedTypes.indexOf(typeID) == -1;
                }); // Filter out skipped types
                // Get all items in model that belong to any of these types

                expressIDArray = [];
                _iterator = _createForOfIteratorHelper(subTypes);
                _context2.prev = 5;

                _iterator.s();

              case 7:
                if ((_step = _iterator.n()).done) {
                  _context2.next = 19;
                  break;
                }

                typeId = _step.value;
                _context2.t0 = expressIDArray.push;
                _context2.t1 = expressIDArray;
                _context2.t2 = _toConsumableArray;
                _context2.next = 14;
                return this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false);

              case 14:
                _context2.t3 = _context2.sent;
                _context2.t4 = (0, _context2.t2)(_context2.t3);

                _context2.t0.apply.call(_context2.t0, _context2.t1, _context2.t4);

              case 17:
                _context2.next = 7;
                break;

              case 19:
                _context2.next = 24;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t5 = _context2["catch"](5);

                _iterator.e(_context2.t5);

              case 24:
                _context2.prev = 24;

                _iterator.f();

                return _context2.finish(24);

              case 27:
                i = 0;

              case 28:
                if (!(i < expressIDArray.length)) {
                  _context2.next = 40;
                  break;
                }

                expressID = expressIDArray[i];
                _context2.next = 32;
                return this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

              case 32:
                _yield$this$ifcAPI$pr = _context2.sent;
                type = _yield$this$ifcAPI$pr.type;
                GlobalId = _yield$this$ifcAPI$pr.GlobalId;
                URI = (0, _uriBuilder.defaultURIBuilder)(GlobalId.value); // Push product

                graph.push({
                  "@id": URI,
                  "@type": "ifc:".concat(_IfcElementsMap.IfcElements[type])
                });

              case 37:
                i++;
                _context2.next = 28;
                break;

              case 40:
                return _context2.abrupt("return", graph);

              case 41:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 21, 24, 27]]);
      }));

      function buildProducts() {
        return _buildProducts.apply(this, arguments);
      }

      return buildProducts;
    }()
  }]);

  return ProductParser;
}(_parser.Parser);

exports.ProductParser = ProductParser;
//# sourceMappingURL=product-parser.js.map