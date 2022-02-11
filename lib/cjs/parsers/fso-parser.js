"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FSOParser = void 0;

var _classAssignment = require("../helpers/class-assignment");

var _parser = require("./parser");

var _uriBuilder = require("../helpers/uri-builder");

var _pathSearch = require("../helpers/path-search");

var _objectPlacement = require("../helpers/object-placement");

var _webIfc = require("web-ifc");

var _itemSearch = require("../helpers/item-search");

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
  2254336722: ["fso:DistributionSystem"],
  3740093272: ["fso:Port"],
  987401354: ["fso:Segment", "fso:Component"],
  4278956645: ["fso:Fitting", "fso:Component"],
  2058353004: ["fso:FlowController", "fso:Component"],
  1658829314: ["fso:EnergyConversionDevice", "fso:Component"],
  3132237377: ["fso:FlowMovingDevice", "fso:Component"],
  707683696: ["fso:StorageDevice", "fso:Component"],
  2223149337: ["fso:Terminal", "fso:Component"],
  3508470533: ["fso:TreatmentDevice", "fso:Component"]
};

var FSOParser = /*#__PURE__*/function (_Parser) {
  _inherits(FSOParser, _Parser);

  var _super = _createSuper(FSOParser);

  function FSOParser() {
    _classCallCheck(this, FSOParser);

    return _super.apply(this, arguments);
  }

  _createClass(FSOParser, [{
    key: "doParse",
    value: function () {
      var _doParse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this$jsonLDObject$G, _this$jsonLDObject$G2, _this$jsonLDObject$G3, _this$jsonLDObject$G4, _this$jsonLDObject$G5, _this$jsonLDObject$G6;

        var portIDs, tripleCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.verbose && console.log("Started FSO parsing");
                this.verbose && console.log("");
                console.time("Finished FSO parsing");
                this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
                this.verbose && console.time("1/10: Classifying FSO items");
                _context.t0 = (_this$jsonLDObject$G = this.jsonLDObject["@graph"]).push;
                _context.t1 = _this$jsonLDObject$G;
                _context.t2 = _toConsumableArray;
                _context.next = 10;
                return this.classify();

              case 10:
                _context.t3 = _context.sent;
                _context.t4 = (0, _context.t2)(_context.t3);

                _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

                this.verbose && console.timeEnd("1/10: Classifying FSO items");
                this.verbose && console.log("");
                this.verbose && console.log("## STEP 2: PORTS ##");
                _context.next = 18;
                return (0, _itemSearch.getAllItemsOfTypeOrSubtype)(this.ifcAPI, this.modelID, _webIfc.IFCPORT);

              case 18:
                portIDs = _context.sent;
                this.verbose && console.time("2/10: Finding port-port connections");
                _context.t5 = (_this$jsonLDObject$G2 = this.jsonLDObject["@graph"]).push;
                _context.t6 = _this$jsonLDObject$G2;
                _context.t7 = _toConsumableArray;
                _context.next = 25;
                return this.portPort();

              case 25:
                _context.t8 = _context.sent;
                _context.t9 = (0, _context.t7)(_context.t8);

                _context.t5.apply.call(_context.t5, _context.t6, _context.t9);

                this.verbose && console.timeEnd("2/10: Finding port-port connections");
                this.verbose && console.time("3/10: Finding port-component connections");
                _context.t10 = (_this$jsonLDObject$G3 = this.jsonLDObject["@graph"]).push;
                _context.t11 = _this$jsonLDObject$G3;
                _context.t12 = _toConsumableArray;
                _context.next = 35;
                return this.portComponent();

              case 35:
                _context.t13 = _context.sent;
                _context.t14 = (0, _context.t12)(_context.t13);

                _context.t10.apply.call(_context.t10, _context.t11, _context.t14);

                this.verbose && console.timeEnd("3/10: Finding port-component connections");
                this.verbose && console.time("4/10: Finding port flow directions");
                _context.t15 = (_this$jsonLDObject$G4 = this.jsonLDObject["@graph"]).push;
                _context.t16 = _this$jsonLDObject$G4;
                _context.t17 = _toConsumableArray;
                _context.next = 45;
                return this.portFlowDirection(portIDs);

              case 45:
                _context.t18 = _context.sent;
                _context.t19 = (0, _context.t17)(_context.t18);

                _context.t15.apply.call(_context.t15, _context.t16, _context.t19);

                this.verbose && console.timeEnd("4/10: Finding port flow directions");
                this.verbose && console.time("5/10: Finding port placements");
                _context.t20 = (_this$jsonLDObject$G5 = this.jsonLDObject["@graph"]).push;
                _context.t21 = _this$jsonLDObject$G5;
                _context.t22 = _toConsumableArray;
                _context.next = 55;
                return this.portPlacements(portIDs);

              case 55:
                _context.t23 = _context.sent;
                _context.t24 = (0, _context.t22)(_context.t23);

                _context.t20.apply.call(_context.t20, _context.t21, _context.t24);

                this.verbose && console.timeEnd("5/10: Finding port placements");
                this.verbose && console.log("");
                this.verbose && console.log("## STEP 3: SYSTEMS ##");
                this.verbose && console.time("6/10: Finding system-component relationships");
                _context.t25 = (_this$jsonLDObject$G6 = this.jsonLDObject["@graph"]).push;
                _context.t26 = _this$jsonLDObject$G6;
                _context.t27 = _toConsumableArray;
                _context.next = 67;
                return this.systemComponent();

              case 67:
                _context.t28 = _context.sent;
                _context.t29 = (0, _context.t27)(_context.t28);

                _context.t25.apply.call(_context.t25, _context.t26, _context.t29);

                this.verbose && console.timeEnd("6/10: Finding system-component relationships");
                this.verbose && console.log("");
                this.verbose && console.log("## STEP 4: POST PROCESSING ##");
                this.verbose && console.time("7/10: Loading data into in-memory triplestore for querying");
                _context.next = 76;
                return this.loadInStore();

              case 76:
                this.verbose && console.timeEnd("7/10: Loading data into in-memory triplestore for querying");
                this.verbose && console.time("8/10: Deducing element conections from ports");
                _context.next = 80;
                return this.componentConections();

              case 80:
                this.verbose && console.timeEnd("8/10: Deducing element conections from ports");
                this.verbose && console.time("9/10: Deducing connection interfaces");
                _context.next = 84;
                return this.connectionInterfaces();

              case 84:
                this.verbose && console.timeEnd("9/10: Deducing connection interfaces");
                this.verbose && console.time("10/10: Calculating segment lengths");
                _context.next = 88;
                return this.segmentLengths();

              case 88:
                this.verbose && console.timeEnd("10/10: Calculating segment lengths");
                console.timeEnd("Finished FSO parsing");

                if (!this.verbose) {
                  _context.next = 95;
                  break;
                }

                _context.next = 93;
                return this.getTripleCount();

              case 93:
                tripleCount = _context.sent;
                console.log("Total triples: " + tripleCount);

              case 95:
                _context.next = 97;
                return this.getTriples();

              case 97:
                return _context.abrupt("return", _context.sent);

              case 98:
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
        var graph, typeIDs, i, typeID, fsoClass;
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
                fsoClass = typeMappings[typeID];
                _context2.t0 = graph.push;
                _context2.t1 = graph;
                _context2.t2 = _toConsumableArray;
                _context2.next = 11;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, typeID, fsoClass, true);

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
     * RELATIONSHIP ASSIGNMENT
     */
    // <port1> fso:connectedPort <port2>
    // <port2> fso:connectedPort <port1>

  }, {
    key: "portPort",
    value: function () {
      var _portPort = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var input;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONNECTSPORTS,
                  ifcSubjectRel: "RelatedPort",
                  ifcTargetRel: "RelatingPort",
                  rdfRelationship: "fso:connectedPort",
                  includeInterface: false,
                  oppoiteRelationship: "fso:connectedPort"
                };
                _context3.next = 3;
                return (0, _pathSearch.buildRelOneToOne)(input);

              case 3:
                return _context3.abrupt("return", _context3.sent);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function portPort() {
        return _portPort.apply(this, arguments);
      }

      return portPort;
    }() // <element> fso:connectedPort <port>
    // <port> fso:connectedElement <element>

  }, {
    key: "portComponent",
    value: function () {
      var _portComponent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var graph, inputA, inputB;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                graph = []; // UNTIL IFC 4, THE RELATIONSHIP IS EXPRESSED WITH IFCRELCONNECTSPORTTOELEMENT

                inputA = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONNECTSPORTTOELEMENT,
                  ifcSubjectRel: "RelatedElement",
                  ifcTargetRel: "RelatingPort",
                  rdfRelationship: "fso:connectedPort",
                  includeInterface: false,
                  oppoiteRelationship: "fso:connectedComponent"
                };
                _context4.t0 = graph.push;
                _context4.t1 = graph;
                _context4.t2 = _toConsumableArray;
                _context4.next = 7;
                return (0, _pathSearch.buildRelOneToOne)(inputA);

              case 7:
                _context4.t3 = _context4.sent;
                _context4.t4 = (0, _context4.t2)(_context4.t3);

                _context4.t0.apply.call(_context4.t0, _context4.t1, _context4.t4);

                // AFTER IFC 4, THE RELATIONSHIP IS EXPRESSED WITH IFCRELNESTS
                // IFCRELNESTS has a 
                inputB = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELNESTS,
                  ifcSubjectRel: "RelatingObject",
                  ifcTargetRel: "RelatedObjects",
                  rdfRelationship: "fso:connectedPort",
                  includeInterface: false,
                  oppoiteRelationship: "fso:connectedComponent"
                };
                _context4.t5 = graph.push;
                _context4.t6 = graph;
                _context4.t7 = _toConsumableArray;
                _context4.next = 16;
                return (0, _pathSearch.buildRelOneToMany)(inputB);

              case 16:
                _context4.t8 = _context4.sent;
                _context4.t9 = (0, _context4.t7)(_context4.t8);

                _context4.t5.apply.call(_context4.t5, _context4.t6, _context4.t9);

                return _context4.abrupt("return", graph);

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function portComponent() {
        return _portComponent.apply(this, arguments);
      }

      return portComponent;
    }() // <system> fso:hasComponent <element>

  }, {
    key: "systemComponent",
    value: function () {
      var _systemComponent = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var input;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELASSIGNSTOGROUP,
                  ifcSubjectRel: "RelatingGroup",
                  ifcTargetRel: "RelatedObjects",
                  rdfRelationship: "fso:hasComponent",
                  ifcSubjectClassIn: [_webIfc.IFCSYSTEM, _webIfc.IFCDISTRIBUTIONSYSTEM]
                };
                _context5.next = 3;
                return (0, _pathSearch.buildRelOneToMany)(input);

              case 3:
                return _context5.abrupt("return", _context5.sent);

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function systemComponent() {
        return _systemComponent.apply(this, arguments);
      }

      return systemComponent;
    }()
    /**
     * PROPERTIES
     */
    // <port> a fso:InPort .
    // <port> a fso:OutPort .
    // <port> a fso:BidirectionalPort .

  }, {
    key: "portFlowDirection",
    value: function () {
      var _portFlowDirection = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(expressIDArray) {
        var graph, i, expressID, props, flowDirection, portType;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // Port property example
                // Description: {type: 1, value: 'Flow'}
                // FlowDirection: {type: 3, value: 'SINK'}
                // GlobalId: {type: 1, value: '1noFI6neD67vh$xlz57Jcc'}
                // Name: {type: 1, value: 'InPort_1614379'}
                // ObjectPlacement: IfcLocalPlacement {expressID: 27954, type: 2624227202, PlacementRelTo: IfcLocalPlacement, RelativePlacement: IfcAxis2Placement3D}
                // ObjectType: null
                // OwnerHistory: IfcOwnerHistory {expressID: 42, type: 1207048766, OwningUser: IfcPersonAndOrganization, OwningApplication: IfcApplication, State: null, …}
                // PredefinedType: undefined
                // Representation: null
                // SystemType: undefined
                // expressID: 27956
                // type: 3041715199
                graph = [];
                i = 0;

              case 2:
                if (!(i < expressIDArray.length)) {
                  _context6.next = 16;
                  break;
                }

                expressID = expressIDArray[i];
                _context6.next = 6;
                return this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

              case 6:
                props = _context6.sent;
                flowDirection = props.FlowDirection.value;
                portType = "";
                if (flowDirection == "SINK") portType = "fso:InPort";
                if (flowDirection == "SOURCE") portType = "fso:OutPort";
                if (flowDirection == "SOURCEANDSINK") portType = "fso:BidirectionalPort";

                if (portType != "") {
                  graph.push({
                    "@id": (0, _uriBuilder.defaultURIBuilder)(props.GlobalId.value),
                    "@type": portType
                  });
                }

              case 13:
                i++;
                _context6.next = 2;
                break;

              case 16:
                return _context6.abrupt("return", graph);

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function portFlowDirection(_x) {
        return _portFlowDirection.apply(this, arguments);
      }

      return portFlowDirection;
    }()
  }, {
    key: "portPlacements",
    value: function () {
      var _portPlacements = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(expressIDArray) {
        var graph, i, expressID, props, coordinates, point, portURI, cpURI;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                graph = [];
                i = 0;

              case 2:
                if (!(i < expressIDArray.length)) {
                  _context7.next = 17;
                  break;
                }

                expressID = expressIDArray[i];
                _context7.next = 6;
                return this.ifcAPI.properties.getItemProperties(this.modelID, expressID, true);

              case 6:
                props = _context7.sent;
                _context7.next = 9;
                return (0, _objectPlacement.getGlobalPosition)(props.ObjectPlacement);

              case 9:
                coordinates = _context7.sent;
                point = "POINT Z(".concat(coordinates[0], " ").concat(coordinates[1], " ").concat(coordinates[2], ")");
                portURI = (0, _uriBuilder.defaultURIBuilder)(props.GlobalId.value);
                cpURI = portURI + "_cp";
                graph.push({
                  "@id": portURI,
                  "omg:hasGeometry": {
                    "@id": cpURI,
                    "@type": ["omg:Geometry", "ex:CenterPoint"],
                    "fog::asSfa_v2-wkt": point
                  }
                });

              case 14:
                i++;
                _context7.next = 2;
                break;

              case 17:
                return _context7.abrupt("return", graph);

              case 18:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function portPlacements(_x2) {
        return _portPlacements.apply(this, arguments);
      }

      return portPlacements;
    }()
    /**
     * POST PROCESSING
     */

  }, {
    key: "componentConections",
    value: function () {
      var _componentConections = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var query;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                query = "PREFIX fso: <https://w3id.org/fso#>\n                    INSERT{\n                        ?e1 fso:connectedWith ?e2 .\n                        ?e2 fso:connectedWith ?e1 .\n                        ?e1 fso:feedsFluidTo ?e2 .\n                        ?e2 fso:hasFluidFedBy ?e1\n                    }\n                    WHERE{\n                        ?e1 fso:connectedPort ?p1 .\n                        ?p1 fso:connectedPort ?p2 .\n                        ?p2 fso:connectedComponent ?e2 .\n                        ?p1 a fso:OutPort .\n                        ?p2 a fso:InPort .\n                    }";
                _context8.next = 3;
                return this.executeUpdateQuery(query);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function componentConections() {
        return _componentConections.apply(this, arguments);
      }

      return componentConections;
    }()
  }, {
    key: "connectionInterfaces",
    value: function () {
      var _connectionInterfaces = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var query;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                query = "PREFIX fso: <https://w3id.org/fso#>\n            PREFIX func: <http://example.org/functions#>\n            INSERT{\n                ?uri a fso:ConnectionPoint ;\n                    fso:connectsFrom ?e1 ;\n                    fso:connectsTo ?e2\n            }\n            WHERE{\n                ?e1 fso:connectedPort ?p1 .\n                ?p1 fso:connectedPort ?p2 .\n                ?p2 fso:connectedComponent ?e2 .\n                ?p1 a fso:OutPort .\n                ?p2 a fso:InPort .\n                BIND(func:uri-concat(?e1, ?e1) AS ?uri)\n            }";
                _context9.next = 3;
                return this.executeUpdateQuery(query);

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function connectionInterfaces() {
        return _connectionInterfaces.apply(this, arguments);
      }

      return connectionInterfaces;
    }() // NB! pretty slow, so probably better to just get them from the IFC directly

  }, {
    key: "segmentLengths",
    value: function () {
      var _segmentLengths = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var query;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                query = "PREFIX fso: <https://w3id.org/fso#>\n        PREFIX omg: <https://w3id.org/omg#>\n        PREFIX fog: <https://w3id.org/fog#>\n        PREFIX ex:  <https://example.com/>\n        PREFIX geosf: <http://www.opengis.net/def/function/geosparql/>\n        INSERT{\n            ?seg ex:length ?d\n        }\n        WHERE{\n            ?seg a fso:Segment ;\n                fso:connectedPort ?port1 , ?port2 .\n            FILTER(?port1 != ?port2)\n            ?port1 omg:hasGeometry/fog::asSfa_v2-wkt ?p1 .\n            ?port2 omg:hasGeometry/fog::asSfa_v2-wkt ?p2 .\n            BIND(geosf:distance(?p1, ?p2, 3) AS ?d)\n        }";
                _context10.next = 3;
                return this.executeUpdateQuery(query);

              case 3:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function segmentLengths() {
        return _segmentLengths.apply(this, arguments);
      }

      return segmentLengths;
    }()
  }]);

  return FSOParser;
}(_parser.Parser);

exports.FSOParser = FSOParser;
//# sourceMappingURL=fso-parser.js.map