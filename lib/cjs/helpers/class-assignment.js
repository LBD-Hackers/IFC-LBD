"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildClassInstances = buildClassInstances;
exports.buildClassInstancesFromExpressIDs = buildClassInstancesFromExpressIDs;

var _itemSearch = require("./item-search");

var _uriBuilder = require("./uri-builder");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function buildClassInstances(_x, _x2, _x3, _x4) {
  return _buildClassInstances.apply(this, arguments);
}

function _buildClassInstances() {
  _buildClassInstances = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ifcAPI, modelID, ifcType, rdfClasses) {
    var includeSubTypes,
        items,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            includeSubTypes = _args.length > 4 && _args[4] !== undefined ? _args[4] : false;

            if (!includeSubTypes) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return (0, _itemSearch.getAllItemsOfTypeOrSubtype)(ifcAPI, modelID, ifcType);

          case 4:
            _context.t0 = _context.sent;
            _context.next = 10;
            break;

          case 7:
            _context.next = 9;
            return ifcAPI.properties.getAllItemsOfType(modelID, ifcType, false);

          case 9:
            _context.t0 = _context.sent;

          case 10:
            items = _context.t0;
            return _context.abrupt("return", buildClassInstancesFromExpressIDs(ifcAPI, modelID, items, rdfClasses));

          case 12:
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
//# sourceMappingURL=class-assignment.js.map