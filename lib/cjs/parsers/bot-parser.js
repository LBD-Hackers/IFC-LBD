"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BOTParser = void 0;

var _pathSearch = require("../helpers/path-search");

var _webIfc = require("web-ifc");

var _classAssignment = require("../helpers/class-assignment");

var _parser = require("./parser");

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

var BOTParser = /*#__PURE__*/function (_Parser) {
  _inherits(BOTParser, _Parser);

  var _super = _createSuper(BOTParser);

  function BOTParser() {
    _classCallCheck(this, BOTParser);

    return _super.apply(this, arguments);
  }

  _createClass(BOTParser, [{
    key: "doParse",
    value: function () {
      var _doParse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this$jsonLDObject$G, _this$jsonLDObject$G2, _this$jsonLDObject$G3, _this$jsonLDObject$G4, _this$jsonLDObject$G5, _this$jsonLDObject$G6, _this$jsonLDObject$G7, _this$jsonLDObject$G8, _this$jsonLDObject$G9, _this$jsonLDObject$G10, _this$jsonLDObject$G11, _this$jsonLDObject$G12;

        var tripleCount;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.verbose && console.log("Started BOT parsing");
                this.verbose && console.log("");
                console.time("Finished BOT parsing"); // Class assignment

                this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
                this.verbose && console.time("1/12: Finding sites");
                _context.t0 = (_this$jsonLDObject$G = this.jsonLDObject["@graph"]).push;
                _context.t1 = _this$jsonLDObject$G;
                _context.t2 = _toConsumableArray;
                _context.next = 10;
                return this.buildSites();

              case 10:
                _context.t3 = _context.sent;
                _context.t4 = (0, _context.t2)(_context.t3);

                _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

                this.verbose && console.timeEnd("1/12: Finding sites");
                this.verbose && console.time("2/12: Finding buildings");
                _context.t5 = (_this$jsonLDObject$G2 = this.jsonLDObject["@graph"]).push;
                _context.t6 = _this$jsonLDObject$G2;
                _context.t7 = _toConsumableArray;
                _context.next = 20;
                return this.buildBuildings();

              case 20:
                _context.t8 = _context.sent;
                _context.t9 = (0, _context.t7)(_context.t8);

                _context.t5.apply.call(_context.t5, _context.t6, _context.t9);

                this.verbose && console.timeEnd("2/12: Finding buildings");
                this.verbose && console.time("3/12: Finding storeys");
                _context.t10 = (_this$jsonLDObject$G3 = this.jsonLDObject["@graph"]).push;
                _context.t11 = _this$jsonLDObject$G3;
                _context.t12 = _toConsumableArray;
                _context.next = 30;
                return this.buildStoreys();

              case 30:
                _context.t13 = _context.sent;
                _context.t14 = (0, _context.t12)(_context.t13);

                _context.t10.apply.call(_context.t10, _context.t11, _context.t14);

                this.verbose && console.timeEnd("3/12: Finding storeys");
                this.verbose && console.time("4/12: Finding spaces");
                _context.t15 = (_this$jsonLDObject$G4 = this.jsonLDObject["@graph"]).push;
                _context.t16 = _this$jsonLDObject$G4;
                _context.t17 = _toConsumableArray;
                _context.next = 40;
                return this.buildSpaces();

              case 40:
                _context.t18 = _context.sent;
                _context.t19 = (0, _context.t17)(_context.t18);

                _context.t15.apply.call(_context.t15, _context.t16, _context.t19);

                this.verbose && console.timeEnd("4/12: Finding spaces");
                this.verbose && console.time("5/12: Finding elements");
                _context.t20 = (_this$jsonLDObject$G5 = this.jsonLDObject["@graph"]).push;
                _context.t21 = _this$jsonLDObject$G5;
                _context.t22 = _toConsumableArray;
                _context.next = 50;
                return this.buildElements();

              case 50:
                _context.t23 = _context.sent;
                _context.t24 = (0, _context.t22)(_context.t23);

                _context.t20.apply.call(_context.t20, _context.t21, _context.t24);

                this.verbose && console.timeEnd("5/12: Finding elements");
                this.verbose && console.log(""); // Space-Element relationships

                this.verbose && console.log("## STEP 2: SPACE-ELEMENT RELATIONSHIPS ##");
                this.verbose && console.time("6/12: Finding spaces' adjacent elements");
                _context.t25 = (_this$jsonLDObject$G6 = this.jsonLDObject["@graph"]).push;
                _context.t26 = _this$jsonLDObject$G6;
                _context.t27 = _toConsumableArray;
                _context.next = 62;
                return this.buildSpaceAdjacentElementRelationships();

              case 62:
                _context.t28 = _context.sent;
                _context.t29 = (0, _context.t27)(_context.t28);

                _context.t25.apply.call(_context.t25, _context.t26, _context.t29);

                this.verbose && console.timeEnd("6/12: Finding spaces' adjacent elements");
                this.verbose && console.time("7/12: Finding spaces' contained elements");
                _context.t30 = (_this$jsonLDObject$G7 = this.jsonLDObject["@graph"]).push;
                _context.t31 = _this$jsonLDObject$G7;
                _context.t32 = _toConsumableArray;
                _context.next = 72;
                return this.buildSpaceContainedElementRelationships();

              case 72:
                _context.t33 = _context.sent;
                _context.t34 = (0, _context.t32)(_context.t33);

                _context.t30.apply.call(_context.t30, _context.t31, _context.t34);

                this.verbose && console.timeEnd("7/12: Finding spaces' contained elements");
                this.verbose && console.time("8/12: Finding storeys' elements");
                _context.t35 = (_this$jsonLDObject$G8 = this.jsonLDObject["@graph"]).push;
                _context.t36 = _this$jsonLDObject$G8;
                _context.t37 = _toConsumableArray;
                _context.next = 82;
                return this.buildStoreyElementRelationships();

              case 82:
                _context.t38 = _context.sent;
                _context.t39 = (0, _context.t37)(_context.t38);

                _context.t35.apply.call(_context.t35, _context.t36, _context.t39);

                this.verbose && console.timeEnd("8/12: Finding storeys' elements");
                this.verbose && console.log(""); // Element-element relationships

                this.verbose && console.log("## STEP 3: ELEMENT-ELEMENT RELATIONSHIPS ##");
                this.verbose && console.time("9/12: Finding elements' hosted elements");
                _context.t40 = (_this$jsonLDObject$G9 = this.jsonLDObject["@graph"]).push;
                _context.t41 = _this$jsonLDObject$G9;
                _context.t42 = _toConsumableArray;
                _context.next = 94;
                return this.buildHostedElementRelationships();

              case 94:
                _context.t43 = _context.sent;
                _context.t44 = (0, _context.t42)(_context.t43);

                _context.t40.apply.call(_context.t40, _context.t41, _context.t44);

                this.verbose && console.timeEnd("9/12: Finding elements' hosted elements");
                this.verbose && console.log(""); // Zone containment

                this.verbose && console.log("## STEP 4: ZONE-ZONE RELATIONSHIPS ##");
                this.verbose && console.time("10/12: Finding storeys' spaces");
                _context.t45 = (_this$jsonLDObject$G10 = this.jsonLDObject["@graph"]).push;
                _context.t46 = _this$jsonLDObject$G10;
                _context.t47 = _toConsumableArray;
                _context.next = 106;
                return this.buildStoreySpaceRelationships();

              case 106:
                _context.t48 = _context.sent;
                _context.t49 = (0, _context.t47)(_context.t48);

                _context.t45.apply.call(_context.t45, _context.t46, _context.t49);

                this.verbose && console.timeEnd("10/12: Finding storeys' spaces");
                this.verbose && console.time("11/12: Finding buildings' storeys");
                _context.t50 = (_this$jsonLDObject$G11 = this.jsonLDObject["@graph"]).push;
                _context.t51 = _this$jsonLDObject$G11;
                _context.t52 = _toConsumableArray;
                _context.next = 116;
                return this.buildBuildingStoreyRelationships();

              case 116:
                _context.t53 = _context.sent;
                _context.t54 = (0, _context.t52)(_context.t53);

                _context.t50.apply.call(_context.t50, _context.t51, _context.t54);

                this.verbose && console.timeEnd("11/12: Finding buildings' storeys");
                this.verbose && console.time("12/12: Finding sties' buildings");
                _context.t55 = (_this$jsonLDObject$G12 = this.jsonLDObject["@graph"]).push;
                _context.t56 = _this$jsonLDObject$G12;
                _context.t57 = _toConsumableArray;
                _context.next = 126;
                return this.buildSiteBuildingRelationships();

              case 126:
                _context.t58 = _context.sent;
                _context.t59 = (0, _context.t57)(_context.t58);

                _context.t55.apply.call(_context.t55, _context.t56, _context.t59);

                this.verbose && console.timeEnd("12/12: Finding sties' buildings");
                this.verbose && console.log("");
                console.timeEnd("Finished BOT parsing");

                if (!this.verbose) {
                  _context.next = 137;
                  break;
                }

                _context.next = 135;
                return this.getTripleCount();

              case 135:
                tripleCount = _context.sent;
                console.log("Total triples: " + tripleCount);

              case 137:
                _context.next = 139;
                return this.getTriples();

              case 139:
                return _context.abrupt("return", _context.sent);

              case 140:
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
    key: "buildSites",
    value: function () {
      var _buildSites = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCSITE, ["bot:Site"]);

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function buildSites() {
        return _buildSites.apply(this, arguments);
      }

      return buildSites;
    }()
  }, {
    key: "buildBuildings",
    value: function () {
      var _buildBuildings = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCBUILDING, ["bot:Building"]);

              case 2:
                return _context3.abrupt("return", _context3.sent);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function buildBuildings() {
        return _buildBuildings.apply(this, arguments);
      }

      return buildBuildings;
    }()
  }, {
    key: "buildStoreys",
    value: function () {
      var _buildStoreys = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCBUILDINGSTOREY, ["bot:Storey"]);

              case 2:
                return _context4.abrupt("return", _context4.sent);

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function buildStoreys() {
        return _buildStoreys.apply(this, arguments);
      }

      return buildStoreys;
    }()
  }, {
    key: "buildSpaces",
    value: function () {
      var _buildSpaces = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCSPACE, ["bot:Space"]);

              case 2:
                return _context5.abrupt("return", _context5.sent);

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function buildSpaces() {
        return _buildSpaces.apply(this, arguments);
      }

      return buildSpaces;
    }()
  }, {
    key: "buildElements",
    value: function () {
      var _buildElements = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var includeSubTypes;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                includeSubTypes = true;
                _context6.next = 3;
                return (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCELEMENT, ["bot:Element"], includeSubTypes);

              case 3:
                return _context6.abrupt("return", _context6.sent);

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function buildElements() {
        return _buildElements.apply(this, arguments);
      }

      return buildElements;
    }()
    /**
     * ZONE-ELEMENT-RELATIONSHIPS
     */

  }, {
    key: "buildSpaceAdjacentElementRelationships",
    value: function () {
      var _buildSpaceAdjacentElementRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var input;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELSPACEBOUNDARY,
                  ifcSubjectRel: "RelatingSpace",
                  ifcTargetRel: "RelatedBuildingElement",
                  rdfRelationship: "bot:adjacentElement",
                  includeInterface: true
                };
                _context7.next = 3;
                return (0, _pathSearch.buildRelOneToOne)(input);

              case 3:
                return _context7.abrupt("return", _context7.sent);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function buildSpaceAdjacentElementRelationships() {
        return _buildSpaceAdjacentElementRelationships.apply(this, arguments);
      }

      return buildSpaceAdjacentElementRelationships;
    }()
  }, {
    key: "buildSpaceContainedElementRelationships",
    value: function () {
      var _buildSpaceContainedElementRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var input;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE,
                  ifcSubjectRel: "RelatingStructure",
                  ifcTargetRel: "RelatedElements",
                  rdfRelationship: "bot:containsElement",
                  ifcSubjectClassIn: [_webIfc.IFCSPACE]
                };
                _context8.next = 3;
                return (0, _pathSearch.buildRelOneToMany)(input);

              case 3:
                return _context8.abrupt("return", _context8.sent);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function buildSpaceContainedElementRelationships() {
        return _buildSpaceContainedElementRelationships.apply(this, arguments);
      }

      return buildSpaceContainedElementRelationships;
    }()
  }, {
    key: "buildStoreyElementRelationships",
    value: function () {
      var _buildStoreyElementRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var input;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE,
                  ifcSubjectRel: "RelatingStructure",
                  ifcTargetRel: "RelatedElements",
                  rdfRelationship: "bot:hasElement",
                  ifcSubjectClassIn: [_webIfc.IFCBUILDINGSTOREY]
                };
                _context9.next = 3;
                return (0, _pathSearch.buildRelOneToMany)(input);

              case 3:
                return _context9.abrupt("return", _context9.sent);

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function buildStoreyElementRelationships() {
        return _buildStoreyElementRelationships.apply(this, arguments);
      }

      return buildStoreyElementRelationships;
    }()
    /**
     * ELEMENT-ELEMENT-RELATIONSHIPS
     */
    // NB! PROBABLY REFERS TO THE VOID AND NOT THE WINDOW!

  }, {
    key: "buildHostedElementRelationships",
    value: function () {
      var _buildHostedElementRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var input;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELVOIDSELEMENT,
                  ifcSubjectRel: "RelatingBuildingElement",
                  ifcTargetRel: "RelatedOpeningElement",
                  rdfRelationship: "bot:hasSubElement"
                };
                _context10.next = 3;
                return (0, _pathSearch.buildRelOneToOne)(input);

              case 3:
                return _context10.abrupt("return", _context10.sent);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function buildHostedElementRelationships() {
        return _buildHostedElementRelationships.apply(this, arguments);
      }

      return buildHostedElementRelationships;
    }()
    /**
     * ZONE-CONTAINMENT
     */

  }, {
    key: "buildStoreySpaceRelationships",
    value: function () {
      var _buildStoreySpaceRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var input;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE,
                  ifcSubjectRel: "RelatingObject",
                  ifcTargetRel: "RelatedObjects",
                  rdfRelationship: "bot:hasSpace",
                  ifcSubjectClassIn: [_webIfc.IFCBUILDINGSTOREY],
                  ifcTargetClassIn: [_webIfc.IFCSPACE]
                };
                _context11.next = 3;
                return (0, _pathSearch.buildRelOneToMany)(input);

              case 3:
                return _context11.abrupt("return", _context11.sent);

              case 4:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function buildStoreySpaceRelationships() {
        return _buildStoreySpaceRelationships.apply(this, arguments);
      }

      return buildStoreySpaceRelationships;
    }()
  }, {
    key: "buildBuildingStoreyRelationships",
    value: function () {
      var _buildBuildingStoreyRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        var input;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE,
                  ifcSubjectRel: "RelatingObject",
                  ifcTargetRel: "RelatedObjects",
                  rdfRelationship: "bot:hasStorey",
                  ifcSubjectClassIn: [_webIfc.IFCBUILDING],
                  ifcTargetClassIn: [_webIfc.IFCBUILDINGSTOREY]
                };
                _context12.next = 3;
                return (0, _pathSearch.buildRelOneToMany)(input);

              case 3:
                return _context12.abrupt("return", _context12.sent);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function buildBuildingStoreyRelationships() {
        return _buildBuildingStoreyRelationships.apply(this, arguments);
      }

      return buildBuildingStoreyRelationships;
    }()
  }, {
    key: "buildSiteBuildingRelationships",
    value: function () {
      var _buildSiteBuildingRelationships = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        var input;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                input = {
                  ifcAPI: this.ifcAPI,
                  modelID: this.modelID,
                  ifcRelationship: _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE,
                  ifcSubjectRel: "RelatingObject",
                  ifcTargetRel: "RelatedObjects",
                  rdfRelationship: "bot:hasBuilding",
                  ifcSubjectClassIn: [_webIfc.IFCSITE],
                  ifcTargetClassIn: [_webIfc.IFCBUILDING]
                };
                _context13.next = 3;
                return (0, _pathSearch.buildRelOneToMany)(input);

              case 3:
                return _context13.abrupt("return", _context13.sent);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function buildSiteBuildingRelationships() {
        return _buildSiteBuildingRelationships.apply(this, arguments);
      }

      return buildSiteBuildingRelationships;
    }()
  }]);

  return BOTParser;
}(_parser.Parser);

exports.BOTParser = BOTParser;
//# sourceMappingURL=bot-parser.js.map