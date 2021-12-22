"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildClassInstances = buildClassInstances;
exports.buildClassInstancesFromExpressIDs = buildClassInstancesFromExpressIDs;
exports.getElementSubtypes = getElementSubtypes;

var _IfcTypesTree = require("./IfcTypesTree");

var _uriBuilder = require("./uri-builder");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function buildClassInstances(_x, _x2, _x3, _x4) {
  return _buildClassInstances.apply(this, arguments);
}

function _buildClassInstances() {
  _buildClassInstances = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ifcAPI, modelID, ifcType, rdfClasses) {
    var includeSubTypes,
        items,
        subTypes,
        i,
        _items,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            includeSubTypes = _args.length > 4 && _args[4] !== undefined ? _args[4] : false;
            items = []; // Traversing IfcProductTree for subtypes takes around 0.3ms, so not very expensive

            if (!includeSubTypes) {
              _context.next = 19;
              break;
            }

            subTypes = getElementSubtypes(ifcType);
            i = 0;

          case 5:
            if (!(i < subTypes.length)) {
              _context.next = 17;
              break;
            }

            _context.t0 = (_items = items).push;
            _context.t1 = _items;
            _context.t2 = _toConsumableArray;
            _context.next = 11;
            return ifcAPI.properties.getAllItemsOfType(modelID, subTypes[i], false);

          case 11:
            _context.t3 = _context.sent;
            _context.t4 = (0, _context.t2)(_context.t3);

            _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

          case 14:
            i++;
            _context.next = 5;
            break;

          case 17:
            _context.next = 22;
            break;

          case 19:
            _context.next = 21;
            return ifcAPI.properties.getAllItemsOfType(modelID, ifcType, false);

          case 21:
            items = _context.sent;

          case 22:
            return _context.abrupt("return", buildClassInstancesFromExpressIDs(ifcAPI, modelID, items, rdfClasses));

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _buildClassInstances.apply(this, arguments);
}

function buildClassInstancesFromExpressIDs(_x5, _x6, _x7, _x8) {
  return _buildClassInstancesFromExpressIDs.apply(this, arguments);
}

function _buildClassInstancesFromExpressIDs() {
  _buildClassInstancesFromExpressIDs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ifcAPI, modelID, expressIDs, rdfClasses) {
    var graph, i, expressID, _yield$ifcAPI$propert, GlobalId, URI;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            graph = [];
            i = 0;

          case 2:
            if (!(i < expressIDs.length)) {
              _context2.next = 13;
              break;
            }

            expressID = expressIDs[i];
            _context2.next = 6;
            return ifcAPI.properties.getItemProperties(modelID, expressID);

          case 6:
            _yield$ifcAPI$propert = _context2.sent;
            GlobalId = _yield$ifcAPI$propert.GlobalId;
            URI = (0, _uriBuilder.defaultURIBuilder)(GlobalId.value); // Push spaces

            graph.push({
              "@id": URI,
              "@type": rdfClasses
            });

          case 10:
            i++;
            _context2.next = 2;
            break;

          case 13:
            return _context2.abrupt("return", graph);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _buildClassInstancesFromExpressIDs.apply(this, arguments);
}

function getElementSubtypes(type) {
  var subTypes = []; // Get the tree node that corresponds to the requested type

  var treeNode = searchProductTree(_IfcTypesTree.IfcTypesTree, type);

  if (treeNode) {
    // Get all typeIds for the node itself and its subtypes
    collectAllIds(treeNode, subTypes);
  }

  return subTypes; // Search IfcProductTree for the particular typeID and get the node

  function searchProductTree(node, typeID) {
    if (node.id == typeID) {
      return node;
    } else if (node.children != null) {
      var i;
      var result = null;

      for (i = 0; result == null && i < node.children.length; i++) {
        result = searchProductTree(node.children[i], typeID);
      }

      return result;
    }

    return null;
  } // Collect all ids of tree node and its children


  function collectAllIds(node) {
    var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    ids.push(node.id);

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        collectAllIds(node.children[i], ids);
      }
    }
  }
}
//# sourceMappingURL=class-assignment.js.map