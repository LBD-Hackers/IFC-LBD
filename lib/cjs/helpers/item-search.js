"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllItemsOfTypeOrSubtype = getAllItemsOfTypeOrSubtype;
exports.getItemSubtypes = getItemSubtypes;

var _IfcTypesTree = require("./IfcTypesTree");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getAllItemsOfTypeOrSubtype(_x, _x2, _x3) {
  return _getAllItemsOfTypeOrSubtype.apply(this, arguments);
}

function _getAllItemsOfTypeOrSubtype() {
  _getAllItemsOfTypeOrSubtype = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ifcAPI, modelID, ifcType) {
    var subTypes, items, i;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            subTypes = getItemSubtypes(ifcType);
            items = [];
            i = 0;

          case 3:
            if (!(i < subTypes.length)) {
              _context.next = 15;
              break;
            }

            _context.t0 = items.push;
            _context.t1 = items;
            _context.t2 = _toConsumableArray;
            _context.next = 9;
            return ifcAPI.properties.getAllItemsOfType(modelID, subTypes[i], false);

          case 9:
            _context.t3 = _context.sent;
            _context.t4 = (0, _context.t2)(_context.t3);

            _context.t0.apply.call(_context.t0, _context.t1, _context.t4);

          case 12:
            i++;
            _context.next = 3;
            break;

          case 15:
            return _context.abrupt("return", items);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAllItemsOfTypeOrSubtype.apply(this, arguments);
}

function getItemSubtypes(type) {
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
//# sourceMappingURL=item-search.js.map