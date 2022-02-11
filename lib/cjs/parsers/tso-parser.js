"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TSOParser = void 0;

var _classAssignment = require("../helpers/class-assignment");

var _parser = require("./parser");

var _pathSearch = require("../helpers/path-search");

var _webIfc = require("web-ifc");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

var typeMappings = {
  3740093272: ["tso:ConnectionPoint"],
  1945004755: ["tso:Component"]
};

var TSOParser = /*#__PURE__*/function (_Parser) {
  _inherits(TSOParser, _Parser);

  var _super = _createSuper(TSOParser);

  function TSOParser() {
    _classCallCheck(this, TSOParser);

    return _super.apply(this, arguments);
  }

  _createClass(TSOParser, [{
    key: "doParse",
    value: function () {
      var _doParse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this$jsonLDObject$G, _this$jsonLDObject$G2;

        var tripleCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.verbose && console.log("Started TSO parsing");
                this.verbose && console.log("");
                console.time("Finished TSO parsing");
                this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
                this.verbose && console.time("1/2: Classifying TSO components");
                _context.t0 = (_this$jsonLDObject$G = this.jsonLDObject["@graph"]).push;
                _context.t1 = _this$jsonLDObject$G;
                _context.t2 = _toConsumableArray;
                _context.next = 10;
                return this.classify();

              case 10:
                _context.t3 = _context.sent;
                _context.t4 = (0, _context.t2)(_context.t3);

                _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

                this.verbose && console.timeEnd("1/2: Classifying TSO components");
                this.verbose && console.log("");
                this.verbose && console.log("## STEP 2: CONNECTION POINTS ##");
                this.verbose && console.time("2/2: Finding port-port connections");
                _context.t5 = (_this$jsonLDObject$G2 = this.jsonLDObject["@graph"]).push;
                _context.t6 = _this$jsonLDObject$G2;
                _context.t7 = _toConsumableArray;
                _context.next = 22;
                return this.connections();

              case 22:
                _context.t8 = _context.sent;
                _context.t9 = (0, _context.t7)(_context.t8);

                _context.t5.apply.call(_context.t5, _context.t6, _context.t9);

                this.verbose && console.timeEnd("2/2: Finding port-port connections");
                console.timeEnd("Finished TSO parsing");

                if (!this.verbose) {
                  _context.next = 32;
                  break;
                }

                _context.next = 30;
                return this.getTripleCount();

              case 30:
                tripleCount = _context.sent;
                console.log("Total triples: " + tripleCount);

              case 32:
                _context.next = 34;
                return this.getTriples();

              case 34:
                return _context.abrupt("return", _context.sent);

              case 35:
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
    /**
     * CLASS ASSIGNMENT
     */

  }, {
    key: "classify",
    value: function () {
      var _classify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var graph, typeIDs, i, typeID, tsoClass;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                graph = [];
                typeIDs = Object.keys(typeMappings);
                i = 0;

              case 3:
                if (!(i < typeIDs.length)) {
                  _context2.next = 17;
                  break;
                }

                typeID = typeIDs[i];
                tsoClass = typeMappings[typeID];
                _context2.t0 = graph.push;
                _context2.t1 = graph;
                _context2.t2 = _toConsumableArray;
                _context2.next = 11;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, typeID, tsoClass, true);

              case 11:
                _context2.t3 = _context2.sent;
                _context2.t4 = (0, _context2.t2)(_context2.t3);

                _context2.t0.apply.call(_context2.t0, _context2.t1, _context2.t4);

              case 14:
                i++;
                _context2.next = 3;
                break;

              case 17:
                return _context2.abrupt("return", graph);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function classify() {
        return _classify.apply(this, arguments);
      }

      return classify;
    }()
    /**
     * RELATIONSHIPS
     */
    // <component> tso:connectsAt <connectionPoint>
    // <connectionPoint> tso:connectionPointOf <component>

  }, {
    key: "connections",
    value: function () {
      var _connections = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var graph, inputA;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                graph = []; // UNTIL IFC 4, THE RELATIONSHIP IS EXPRESSED WITH IFCRELCONNECTSPORTTOELEMENT

                inputA = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONNECTSPORTTOELEMENT,
                  ifcSubjectRel: "RelatedElement",
                  ifcTargetRel: "RelatingPort",
                  rdfRelationship: "tso:connectsAt",
                  oppoiteRelationship: "tso:connectionPointOf"
                };
                _context3.t0 = graph.push;
                _context3.t1 = graph;
                _context3.t2 = _toConsumableArray;
                _context3.next = 7;
                return (0, _pathSearch.buildRelOneToOne)(inputA);

              case 7:
                _context3.t3 = _context3.sent;
                _context3.t4 = (0, _context3.t2)(_context3.t3);

                _context3.t0.apply.call(_context3.t0, _context3.t1, _context3.t4);

                return _context3.abrupt("return", graph);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function connections() {
        return _connections.apply(this, arguments);
      }

      return connections;
    }()
  }]);

  return TSOParser;
}(_parser.Parser);

exports.TSOParser = TSOParser;
//# sourceMappingURL=tso-parser.js.map