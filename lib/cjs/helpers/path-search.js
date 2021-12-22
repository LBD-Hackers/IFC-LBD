"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

function buildRelOneToOne(_x) {
  return _buildRelOneToOne.apply(this, arguments);
}

function _buildRelOneToOne() {
  _buildRelOneToOne = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ifcAPI) {
    var modelID,
        relationshipType,
        subjectRef,
        targetRef,
        rdfRelationship,
        includeInterface,
        biderectional,
        graph,
        rels,
        i,
        relID,
        relProps,
        _yield$Promise$all,
        _yield$Promise$all2,
        subject,
        target,
        subjectURI,
        targetURI,
        interfaceURI,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            modelID = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
            relationshipType = _args.length > 2 ? _args[2] : undefined;
            subjectRef = _args.length > 3 ? _args[3] : undefined;
            targetRef = _args.length > 4 ? _args[4] : undefined;
            rdfRelationship = _args.length > 5 ? _args[5] : undefined;
            includeInterface = _args.length > 6 && _args[6] !== undefined ? _args[6] : false;
            biderectional = _args.length > 7 && _args[7] !== undefined ? _args[7] : false;
            graph = [];
            _context.next = 10;
            return ifcAPI.properties.getAllItemsOfType(modelID, relationshipType, false);

          case 10:
            rels = _context.sent;
            i = 0;

          case 12:
            if (!(i < rels.length)) {
              _context.next = 34;
              break;
            }

            relID = rels[i];
            _context.next = 16;
            return ifcAPI.properties.getItemProperties(modelID, relID);

          case 16:
            relProps = _context.sent;

            if (!(!relProps[subjectRef] || !relProps[targetRef])) {
              _context.next = 19;
              break;
            }

            return _context.abrupt("continue", 31);

          case 19:
            _context.next = 21;
            return Promise.all([ifcAPI.properties.getItemProperties(modelID, relProps[subjectRef].value), ifcAPI.properties.getItemProperties(modelID, relProps[targetRef].value)]);

          case 21:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
            subject = _yield$Promise$all2[0];
            target = _yield$Promise$all2[1];
            subjectURI = (0, _uriBuilder.defaultURIBuilder)(subject.GlobalId.value);
            targetURI = (0, _uriBuilder.defaultURIBuilder)(target.GlobalId.value);
            interfaceURI = (0, _uriBuilder.defaultURIBuilder)(relProps.GlobalId.value); // Push relationships

            graph.push(_defineProperty({
              "@id": subjectURI
            }, rdfRelationship, {
              "@id": targetURI
            })); // Optionally, push it in opposite direction

            if (biderectional) {
              graph.push(_defineProperty({
                "@id": targetURI
              }, rdfRelationship, {
                "@id": subjectURI
              }));
            } // Optionally, also include the interface


            if (includeInterface) {
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

          case 31:
            i++;
            _context.next = 12;
            break;

          case 34:
            return _context.abrupt("return", graph);

          case 35:
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
  _buildRelOneToMany = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ifcAPI) {
    var modelID,
        relationshipType,
        subjectRef,
        targetRef,
        rdfRelationship,
        subjectClassConstraint,
        targetClassConstraint,
        graph,
        rels,
        i,
        relID,
        relProps,
        subject,
        targetPromises,
        _i2,
        targets,
        targetObjects,
        subjectURI,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            modelID = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
            relationshipType = _args2.length > 2 ? _args2[2] : undefined;
            subjectRef = _args2.length > 3 ? _args2[3] : undefined;
            targetRef = _args2.length > 4 ? _args2[4] : undefined;
            rdfRelationship = _args2.length > 5 ? _args2[5] : undefined;
            subjectClassConstraint = _args2.length > 6 ? _args2[6] : undefined;
            targetClassConstraint = _args2.length > 7 ? _args2[7] : undefined;
            graph = [];
            _context2.next = 10;
            return ifcAPI.properties.getAllItemsOfType(modelID, relationshipType, false);

          case 10:
            rels = _context2.sent;
            i = 0;

          case 12:
            if (!(i < rels.length)) {
              _context2.next = 37;
              break;
            }

            relID = rels[i];
            _context2.next = 16;
            return ifcAPI.properties.getItemProperties(modelID, relID);

          case 16:
            relProps = _context2.sent;

            if (!(!relProps[subjectRef] || !relProps[targetRef])) {
              _context2.next = 19;
              break;
            }

            return _context2.abrupt("continue", 34);

          case 19:
            _context2.next = 21;
            return ifcAPI.properties.getItemProperties(modelID, relProps[subjectRef].value);

          case 21:
            subject = _context2.sent;

            if (!(subjectClassConstraint && subject.type != subjectClassConstraint)) {
              _context2.next = 24;
              break;
            }

            return _context2.abrupt("continue", 34);

          case 24:
            targetPromises = [];

            for (_i2 = 0; _i2 < relProps[targetRef].length; _i2++) {
              targetPromises.push(ifcAPI.properties.getItemProperties(modelID, relProps[targetRef][_i2].value));
            }

            _context2.next = 28;
            return Promise.all(targetPromises);

          case 28:
            targets = _context2.sent;
            targetObjects = targets.filter(function (t) {
              // It might be that we are only interested in relationship where the target fulfills the constraint
              if (targetClassConstraint && t.type != targetClassConstraint) return false;
              return true;
            }).map(function (t) {
              var targetURI = (0, _uriBuilder.defaultURIBuilder)(t.GlobalId.value);
              return {
                "@id": targetURI
              };
            }); // Skip if no target objects

            if (targetObjects.length) {
              _context2.next = 32;
              break;
            }

            return _context2.abrupt("continue", 34);

          case 32:
            subjectURI = (0, _uriBuilder.defaultURIBuilder)(subject.GlobalId.value); // Push relationships

            graph.push(_defineProperty({
              "@id": subjectURI
            }, rdfRelationship, targetObjects));

          case 34:
            i++;
            _context2.next = 12;
            break;

          case 37:
            return _context2.abrupt("return", graph);

          case 38:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _buildRelOneToMany.apply(this, arguments);
}
//# sourceMappingURL=path-search.js.map