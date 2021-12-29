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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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
  3205830791: ["fso:DistributionSystem"],
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
        var _this$jsonLDObject$G, _this$jsonLDObject$G2, _this$jsonLDObject$G3, _this$jsonLDObject$G4, _this$jsonLDObject$G5;

        var portIDs, tripleCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.verbose && console.log("Started FSO parsing");
                this.verbose && console.log("");
                console.time("Finished FSO parsing");
                this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
                this.verbose && console.time("1/8: Classifying FSO items");
                _context.t0 = (_this$jsonLDObject$G = this.jsonLDObject["@graph"]).push;
                _context.t1 = _this$jsonLDObject$G;
                _context.t2 = _toConsumableArray;
                _context.next = 10;
                return this.classify();

              case 10:
                _context.t3 = _context.sent;
                _context.t4 = (0, _context.t2)(_context.t3);

                _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

                this.verbose && console.timeEnd("1/8: Classifying FSO items");
                this.verbose && console.log("");
                this.verbose && console.log("## STEP 2: PORTS ##");
                _context.next = 18;
                return this.getPortIDs();

              case 18:
                portIDs = _context.sent;
                this.verbose && console.time("2/8: Finding port-port connections");
                _context.t5 = (_this$jsonLDObject$G2 = this.jsonLDObject["@graph"]).push;
                _context.t6 = _this$jsonLDObject$G2;
                _context.t7 = _toConsumableArray;
                _context.next = 25;
                return this.portPort();

              case 25:
                _context.t8 = _context.sent;
                _context.t9 = (0, _context.t7)(_context.t8);

                _context.t5.apply.call(_context.t5, _context.t6, _context.t9);

                this.verbose && console.timeEnd("2/8: Finding port-port connections");
                this.verbose && console.time("3/8: Finding port-component connections");
                _context.t10 = (_this$jsonLDObject$G3 = this.jsonLDObject["@graph"]).push;
                _context.t11 = _this$jsonLDObject$G3;
                _context.t12 = _toConsumableArray;
                _context.next = 35;
                return this.portComponent();

              case 35:
                _context.t13 = _context.sent;
                _context.t14 = (0, _context.t12)(_context.t13);

                _context.t10.apply.call(_context.t10, _context.t11, _context.t14);

                this.verbose && console.timeEnd("3/8: Finding port-component connections");
                this.verbose && console.time("4/8: Finding port flow directions");
                _context.t15 = (_this$jsonLDObject$G4 = this.jsonLDObject["@graph"]).push;
                _context.t16 = _this$jsonLDObject$G4;
                _context.t17 = _toConsumableArray;
                _context.next = 45;
                return this.portFlowDirection(portIDs);

              case 45:
                _context.t18 = _context.sent;
                _context.t19 = (0, _context.t17)(_context.t18);

                _context.t15.apply.call(_context.t15, _context.t16, _context.t19);

                this.verbose && console.timeEnd("4/8: Finding port flow directions");
                this.verbose && console.time("5/8: Finding port placements");
                _context.t20 = (_this$jsonLDObject$G5 = this.jsonLDObject["@graph"]).push;
                _context.t21 = _this$jsonLDObject$G5;
                _context.t22 = _toConsumableArray;
                _context.next = 55;
                return this.portPlacements(portIDs);

              case 55:
                _context.t23 = _context.sent;
                _context.t24 = (0, _context.t22)(_context.t23);

                _context.t20.apply.call(_context.t20, _context.t21, _context.t24);

                this.verbose && console.timeEnd("5/8: Finding port placements");
                this.verbose && console.log(""); // NB! The following steps require an in-memory triplestore to run which is slower than just operating the JSON-LD object

                this.verbose && console.log("## STEP 3: POST PROCESSING ##");
                this.verbose && console.time("6/8: Loading data into in-memory triplestore for querying");
                _context.next = 64;
                return this.loadInStore();

              case 64:
                this.verbose && console.timeEnd("6/8: Loading data into in-memory triplestore for querying");
                this.verbose && console.time("7/8: Deducing element conections from ports"); // await this.componentConections();

                this.verbose && console.timeEnd("7/8: Deducing element conections from ports");
                this.verbose && console.time("8/8: Deducing connection interfaces");
                _context.next = 70;
                return this.connectionInterfaces();

              case 70:
                this.verbose && console.timeEnd("8/8: Deducing connection interfaces");
                console.timeEnd("Finished FSO parsing");

                if (!this.verbose) {
                  _context.next = 77;
                  break;
                }

                _context.next = 75;
                return this.getTripleCount();

              case 75:
                tripleCount = _context.sent;
                console.log("Total triples: " + tripleCount);

              case 77:
                _context.next = 79;
                return this.getTriples();

              case 79:
                return _context.abrupt("return", _context.sent);

              case 80:
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
        var IFCRELCONNECTSPORTS, subjectRef, targetRef, rdfRelationship;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                IFCRELCONNECTSPORTS = 3190031847;
                subjectRef = "RelatedPort";
                targetRef = "RelatingPort";
                rdfRelationship = "fso:connectedPort";
                _context3.next = 6;
                return (0, _pathSearch.buildRelOneToOne)(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTS, subjectRef, targetRef, rdfRelationship, false, true);

              case 6:
                return _context3.abrupt("return", _context3.sent);

              case 7:
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
        var IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship, r1, r2;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                IFCRELCONNECTSPORTTOELEMENT = 4201705270;
                subjectRef = "RelatedElement";
                targetRef = "RelatingPort";
                rdfRelationship = "fso:connectedPort";
                _context4.next = 6;
                return (0, _pathSearch.buildRelOneToOne)(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship);

              case 6:
                r1 = _context4.sent;
                subjectRef = "RelatingPort";
                targetRef = "RelatedElement";
                rdfRelationship = "fso:connectedComponent";
                _context4.next = 12;
                return (0, _pathSearch.buildRelOneToOne)(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship);

              case 12:
                r2 = _context4.sent;
                return _context4.abrupt("return", r1.concat(r2));

              case 14:
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
      var _portFlowDirection = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(expressIDArray) {
        var graph, i, expressID, props, flowDirection, portType;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
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
                  _context5.next = 16;
                  break;
                }

                expressID = expressIDArray[i];
                _context5.next = 6;
                return this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

              case 6:
                props = _context5.sent;
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
                _context5.next = 2;
                break;

              case 16:
                return _context5.abrupt("return", graph);

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function portFlowDirection(_x) {
        return _portFlowDirection.apply(this, arguments);
      }

      return portFlowDirection;
    }()
  }, {
    key: "portPlacements",
    value: function () {
      var _portPlacements = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(expressIDArray) {
        var graph, i, expressID, props, coordinates, point, portURI, cpURI;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                graph = [];
                i = 0;

              case 2:
                if (!(i < expressIDArray.length)) {
                  _context6.next = 17;
                  break;
                }

                expressID = expressIDArray[i];
                _context6.next = 6;
                return this.ifcAPI.properties.getItemProperties(this.modelID, expressID, true);

              case 6:
                props = _context6.sent;
                _context6.next = 9;
                return (0, _objectPlacement.getGlobalPosition)(props.ObjectPlacement);

              case 9:
                coordinates = _context6.sent;
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
                _context6.next = 2;
                break;

              case 17:
                return _context6.abrupt("return", graph);

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
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
      var _componentConections = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var query;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                query = "PREFIX fso: <https://w3id.org/fso#>\n                    INSERT{\n                        ?e1 fso:connectedWith ?e2 .\n                        ?e2 fso:connectedWith ?e1 .\n                        ?e1 fso:feedsFluidTo ?e2 .\n                        ?e2 fso:hasFluidFedBy ?e1\n                    }\n                    WHERE{\n                        ?e1 fso:connectedPort ?p1 .\n                        ?p1 fso:connectedPort ?p2 .\n                        ?p2 fso:connectedComponent ?e2 .\n                        ?p1 a fso:OutPort .\n                        ?p2 a fso:InPort .\n                    }";
                _context7.next = 3;
                return this.executeUpdateQuery(query);

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function componentConections() {
        return _componentConections.apply(this, arguments);
      }

      return componentConections;
    }()
  }, {
    key: "connectionInterfaces",
    value: function () {
      var _connectionInterfaces = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var query;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                // const query = `PREFIX fso: <https://w3id.org/fso#>
                //     INSERT{
                //         ?uri a fso:ConnectionPoint ;
                //             fso:connectsFrom ?e1 ;
                //             fso:connectsTo ?e2
                //     }
                //     WHERE{
                //         ?e1 fso:connectedPort ?p1 .
                //         ?p1 fso:connectedPort ?p2 .
                //         ?p2 fso:connectedComponent ?e2 .
                //         ?p1 a fso:OutPort .
                //         ?p2 a fso:InPort .
                //         # BUILD NEW URI AS CONCATENATION OF NAMESPACE AND THE ID OF E1 + E2
                //         BIND(REPLACE(STR(?e1), '([^\\/]+$)', '') AS ?ns)
                //         BIND(REPLACE(STR(?e1), '^(.*[\\/])', '') AS ?id1)
                //         BIND(REPLACE(STR(?e2), '^(.*[\\/])', '') AS ?id2)
                //         BIND(IRI(CONCAT(?ns, ?id1, ?id2)) AS ?uri)
                //     }`;
                // await this.executeUpdateQuery(query);
                // const query = `PREFIX fso: <https://w3id.org/fso#>
                //     PREFIX func: <http://example.org/functions#>
                //     SELECT ?e1 ?p1
                //     WHERE{
                //         ?e1 fso:connectedPort ?p1 .
                //         ?p1 fso:connectedPort ?p2 .
                //         #?p2 fso:connectedComponent ?e2 .
                //         #?p1 a fso:OutPort .
                //         #?p2 a fso:InPort .
                //         #BIND(func:uri-concat(?e1, ?p1) AS ?uri)
                //     }`;
                query = "PREFIX fso: <https://w3id.org/fso#>\n            SELECT *\n            WHERE{\n                ?e1 fso:connectedPort ?p1 .\n                ?p1 fso:connectedPort ?p2 .\n                ?p2 fso:connectedComponent ?e2 .\n                ?p1 a fso:OutPort .\n                ?p2 a fso:InPort .\n            }";
                _context8.next = 3;
                return this.executeSelectQuery(query);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function connectionInterfaces() {
        return _connectionInterfaces.apply(this, arguments);
      }

      return connectionInterfaces;
    }()
  }, {
    key: "getPortIDs",
    value: function () {
      var _getPortIDs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var IFCPORT, subTypes, expressIDArray, _iterator, _step, typeId;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                // Get all subTypes of IfcPort
                IFCPORT = 3740093272;
                subTypes = (0, _classAssignment.getElementSubtypes)(IFCPORT); // Get all items in model that belong to any of these types

                expressIDArray = [];
                _iterator = _createForOfIteratorHelper(subTypes);
                _context9.prev = 4;

                _iterator.s();

              case 6:
                if ((_step = _iterator.n()).done) {
                  _context9.next = 18;
                  break;
                }

                typeId = _step.value;
                _context9.t0 = expressIDArray.push;
                _context9.t1 = expressIDArray;
                _context9.t2 = _toConsumableArray;
                _context9.next = 13;
                return this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false);

              case 13:
                _context9.t3 = _context9.sent;
                _context9.t4 = (0, _context9.t2)(_context9.t3);

                _context9.t0.apply.call(_context9.t0, _context9.t1, _context9.t4);

              case 16:
                _context9.next = 6;
                break;

              case 18:
                _context9.next = 23;
                break;

              case 20:
                _context9.prev = 20;
                _context9.t5 = _context9["catch"](4);

                _iterator.e(_context9.t5);

              case 23:
                _context9.prev = 23;

                _iterator.f();

                return _context9.finish(23);

              case 26:
                return _context9.abrupt("return", expressIDArray);

              case 27:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[4, 20, 23, 26]]);
      }));

      function getPortIDs() {
        return _getPortIDs.apply(this, arguments);
      }

      return getPortIDs;
    }()
  }]);

  return FSOParser;
}(_parser.Parser);

exports.FSOParser = FSOParser;
//# sourceMappingURL=fso-parser.js.map