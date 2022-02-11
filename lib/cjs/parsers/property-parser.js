"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertyParser = void 0;

var _webIfc = require("web-ifc");

var _parser = require("./parser");

var _itemSearch = require("../helpers/item-search");

var _uriBuilder = require("../helpers/uri-builder");

var _characterDecode = require("../helpers/character-decode");

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

var PropertyParser = /*#__PURE__*/function (_Parser) {
  _inherits(PropertyParser, _Parser);

  var _super = _createSuper(PropertyParser);

  function PropertyParser() {
    _classCallCheck(this, PropertyParser);

    return _super.apply(this, arguments);
  }

  _createClass(PropertyParser, [{
    key: "doParse",
    value: // Holds expressIDs for all relevant items
    function () {
      var _doParse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this$jsonLDObject$G;

        var tripleCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.verbose && console.log("Started PROPERTIES parsing");
                this.verbose && console.log("");
                console.time("Finished PROPERTIES parsing");
                this.verbose && console.log("## PRE STEPS ##");
                this.verbose && console.time("Getting element and group IDs");
                _context.next = 7;
                return this.getAllRelevantItems();

              case 7:
                this.itemIDs = _context.sent;
                this.verbose && console.timeEnd("Getting element and group IDs");
                this.verbose && console.log("## STEP 1: DIRECT PROPERTIES ##");
                this.verbose && console.time("1/1: Finding direct properties");
                _context.t0 = (_this$jsonLDObject$G = this.jsonLDObject["@graph"]).push;
                _context.t1 = _this$jsonLDObject$G;
                _context.t2 = _toConsumableArray;
                _context.next = 16;
                return this.getElementProperties();

              case 16:
                _context.t3 = _context.sent;
                _context.t4 = (0, _context.t2)(_context.t3);

                _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

                this.verbose && console.timeEnd("1/1: Finding direct properties");
                console.log("");
                console.timeEnd("Finished PROPERTIES parsing");

                if (!this.verbose) {
                  _context.next = 27;
                  break;
                }

                _context.next = 25;
                return this.getTripleCount();

              case 25:
                tripleCount = _context.sent;
                console.log("Total triples: " + tripleCount);

              case 27:
                _context.next = 29;
                return this.getTriples();

              case 29:
                return _context.abrupt("return", _context.sent);

              case 30:
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
    key: "getAllRelevantItems",
    value: function () {
      var _getAllRelevantItems = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var arr;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                arr = [];
                _context2.t0 = arr.push;
                _context2.t1 = arr;
                _context2.t2 = _toConsumableArray;
                _context2.next = 6;
                return (0, _itemSearch.getAllItemsOfTypeOrSubtype)(this.ifcAPI, this.modelID, _webIfc.IFCPRODUCT);

              case 6:
                _context2.t3 = _context2.sent;
                _context2.t4 = (0, _context2.t2)(_context2.t3);

                _context2.t0.apply.call(_context2.t0, _context2.t1, _context2.t4);

                _context2.t5 = arr.push;
                _context2.t6 = arr;
                _context2.t7 = _toConsumableArray;
                _context2.next = 14;
                return (0, _itemSearch.getAllItemsOfTypeOrSubtype)(this.ifcAPI, this.modelID, _webIfc.IFCGROUP);

              case 14:
                _context2.t8 = _context2.sent;
                _context2.t9 = (0, _context2.t7)(_context2.t8);

                _context2.t5.apply.call(_context2.t5, _context2.t6, _context2.t9);

                return _context2.abrupt("return", arr);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getAllRelevantItems() {
        return _getAllRelevantItems.apply(this, arguments);
      }

      return getAllRelevantItems;
    }()
    /**
     * DIRECT
     */

  }, {
    key: "getElementProperties",
    value: function () {
      var _getElementProperties = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var graph, i, _properties$Name, _properties$Descripti, expressID, properties, name, globalId, description, URI, obj;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                graph = [];
                i = 0;

              case 2:
                if (!(i < this.itemIDs.length)) {
                  _context3.next = 19;
                  break;
                }

                expressID = this.itemIDs[i];
                _context3.next = 6;
                return this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

              case 6:
                properties = _context3.sent;
                // Example
                // IfcCooledBeam {
                //     expressID: 2701,
                //     type: 4136498852,
                //     GlobalId: { type: 1, value: '0MMKrFmIr4b8IaMYvCQ0YS' },
                //     OwnerHistory: { type: 5, value: 42 },
                //     Name: {
                //       type: 1,
                //       value: 'DID642-4-S2-RR-AV 1200x900-593 158 158 LE - TROX Technik (DEU) #s8hqpa4#:Standard:7295696'
                //     },
                //     Description: null,
                //     ObjectType: {
                //       type: 1,
                //       value: 'DID642-4-S2-RR-AV 1200x900-593 158 158 LE - TROX Technik (DEU) #s8hqpa4#:Standard'
                //     },
                //     ObjectPlacement: { type: 5, value: 2699 },
                //     Representation: { type: 5, value: 2689 },
                //     Tag: { type: 1, value: '7295696' },
                //     PredefinedType: { type: 3, value: 'ACTIVE' }
                //   }
                name = (_properties$Name = properties.Name) === null || _properties$Name === void 0 ? void 0 : _properties$Name.value;
                globalId = properties.GlobalId.value;
                description = (_properties$Descripti = properties.Description) === null || _properties$Descripti === void 0 ? void 0 : _properties$Descripti.value;
                URI = (0, _uriBuilder.defaultURIBuilder)(globalId);
                obj = {
                  "@id": URI,
                  "ex:globalId": globalId
                };
                if (name != undefined) obj["rdfs:label"] = (0, _characterDecode.decodeString)(name);
                if (description != undefined) obj["rdfs:description"] = description; // Specific for ports

                if (properties.type == _webIfc.IFCPORT || properties.type == _webIfc.IFCDISTRIBUTIONPORT) {
                  obj["ex:flowDirection"] = properties.FlowDirection.value;
                } // // Specific for systems
                // if(properties.type == IFCSYSTEM || properties.type == IFCDISTRIBUTIONSYSTEM){
                //     console.log(properties);
                // }


                graph.push(obj);

              case 16:
                i++;
                _context3.next = 2;
                break;

              case 19:
                return _context3.abrupt("return", graph);

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getElementProperties() {
        return _getElementProperties.apply(this, arguments);
      }

      return getElementProperties;
    }()
  }]);

  return PropertyParser;
}(_parser.Parser);

exports.PropertyParser = PropertyParser;
//# sourceMappingURL=property-parser.js.map