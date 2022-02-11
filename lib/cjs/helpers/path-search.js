"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;
exports.buildRelOneToMany = buildRelOneToMany;
exports.buildRelOneToOne = buildRelOneToOne;

var _uriBuilder = require("./uri-builder");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = /*#__PURE__*/_createClass(function Input() {
  _classCallCheck(this, Input);
}); // ifcAPI: WebIFC.IfcAPI, modelID: number = 0, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, includeInterface: boolean = false, biderectional: boolean = false


exports.Input = Input;

function buildRelOneToOne(_x) {
  return _buildRelOneToOne.apply(this, arguments);
} // ifcAPI: WebIFC.IfcAPI, modelID: number = 0, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, subjectClassConstraint?: number, targetClassConstraint?: number


function _buildRelOneToOne() {
  _buildRelOneToOne = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(d) {
    var graph, rels, i, relID, relProps, _yield$Promise$all, _yield$Promise$all2, subject, target, subjectURI, targetURI, interfaceURI;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (d.includeInterface == undefined) d.includeInterface = false;
            graph = [];
            _context.next = 4;
            return d.ifcAPI.properties.getAllItemsOfType(d.modelID, d.ifcRelationship, false);

          case 4:
            rels = _context.sent;
            i = 0;

          case 6:
            if (!(i < rels.length)) {
              _context.next = 30;
              break;
            }

            relID = rels[i];
            _context.next = 10;
            return d.ifcAPI.properties.getItemProperties(d.modelID, relID);

          case 10:
            relProps = _context.sent;

            if (!(!relProps[d.ifcSubjectRel] || !relProps[d.ifcTargetRel])) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("continue", 27);

          case 13:
            _context.next = 15;
            return Promise.all([d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcSubjectRel].value), d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcTargetRel].value)]);

          case 15:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            subject = _yield$Promise$all2[0];
            target = _yield$Promise$all2[1];

            if (subject.GlobalId.value == "0dG4XB8Mj2QhLcDnrkJh$F") {
              console.log("subject");
            }

            if (target.GlobalId.value == "0dG4XB8Mj2QhLcDnrkJh$F") {
              console.log("target");
            }

            subjectURI = (0, _uriBuilder.defaultURIBuilder)(subject.GlobalId.value);
            targetURI = (0, _uriBuilder.defaultURIBuilder)(target.GlobalId.value);
            interfaceURI = (0, _uriBuilder.defaultURIBuilder)(relProps.GlobalId.value); // Push relationships

            graph.push(_defineProperty({
              "@id": subjectURI
            }, d.rdfRelationship, {
              "@id": targetURI
            })); // Optionally, push it in opposite direction

            if (d.oppoiteRelationship != undefined) {
              graph.push(_defineProperty({
                "@id": targetURI
              }, d.oppoiteRelationship, {
                "@id": subjectURI
              }));
            } // Optionally, also include the interface


            if (d.includeInterface) {
              graph.push({
                "@id": interfaceURI,
                "@type": "bot:Interface",
                "ex:expressID": relProps.expressID,
                "bot:interfaceOf": [{
                  "@id": subjectURI
                }, {
                  "@id": targetURI
                }]
              });
            }

          case 27:
            i++;
            _context.next = 6;
            break;

          case 30:
            return _context.abrupt("return", graph);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _buildRelOneToOne.apply(this, arguments);
}

function buildRelOneToMany(_x2) {
  return _buildRelOneToMany.apply(this, arguments);
}

function _buildRelOneToMany() {
  _buildRelOneToMany = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(d) {
    var graph, rels, i, relID, relProps, subject, targetPromises, _i2, targets, targetObjects, subjectURI;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (d.ifcSubjectClassIn == undefined) d.ifcSubjectClassIn = [];
            if (d.ifcTargetClassIn == undefined) d.ifcTargetClassIn = [];
            graph = [];
            _context2.next = 5;
            return d.ifcAPI.properties.getAllItemsOfType(d.modelID, d.ifcRelationship, false);

          case 5:
            rels = _context2.sent;
            i = 0;

          case 7:
            if (!(i < rels.length)) {
              _context2.next = 32;
              break;
            }

            relID = rels[i];
            _context2.next = 11;
            return d.ifcAPI.properties.getItemProperties(d.modelID, relID);

          case 11:
            relProps = _context2.sent;

            if (!(!relProps[d.ifcSubjectRel] || !relProps[d.ifcTargetRel])) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("continue", 29);

          case 14:
            _context2.next = 16;
            return d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcSubjectRel].value);

          case 16:
            subject = _context2.sent;

            if (!(d.ifcSubjectClassIn.length && !d.ifcSubjectClassIn.includes(subject.type))) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("continue", 29);

          case 19:
            targetPromises = [];

            for (_i2 = 0; _i2 < relProps[d.ifcTargetRel].length; _i2++) {
              targetPromises.push(d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcTargetRel][_i2].value));
            }

            _context2.next = 23;
            return Promise.all(targetPromises);

          case 23:
            targets = _context2.sent;
            targetObjects = targets.filter(function (t) {
              // It might be that we are only interested in relationship where the target fulfills the constraint
              if (d.ifcTargetClassIn.length && !d.ifcTargetClassIn.includes(t.type)) return false;
              return true;
            }).map(function (t) {
              var targetURI = (0, _uriBuilder.defaultURIBuilder)(t.GlobalId.value);
              return {
                "@id": targetURI
              };
            }); // Skip if no target objects

            if (targetObjects.length) {
              _context2.next = 27;
              break;
            }

            return _context2.abrupt("continue", 29);

          case 27:
            subjectURI = (0, _uriBuilder.defaultURIBuilder)(subject.GlobalId.value); // Push relationships

            graph.push(_defineProperty({
              "@id": subjectURI
            }, d.rdfRelationship, targetObjects));

          case 29:
            i++;
            _context2.next = 7;
            break;

          case 32:
            return _context2.abrupt("return", graph);

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _buildRelOneToMany.apply(this, arguments);
}
//# sourceMappingURL=path-search.js.map