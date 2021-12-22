"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildClassInstances = buildClassInstances;
exports.buildClassInstancesFromExpressIDs = buildClassInstancesFromExpressIDs;
exports.getElementSubtypes = getElementSubtypes;

var _IfcTypesTree = require("./IfcTypesTree");

var _uriBuilder = require("./uri-builder");

async function buildClassInstances(ifcAPI, modelID, ifcType, rdfClasses, includeSubTypes = false) {
  let items = []; // Traversing IfcProductTree for subtypes takes around 0.3ms, so not very expensive

  if (includeSubTypes) {
    const subTypes = getElementSubtypes(ifcType);

    for (let i = 0; i < subTypes.length; i++) {
      items.push(...(await ifcAPI.properties.getAllItemsOfType(modelID, subTypes[i], false)));
    }
  } else {
    items = await ifcAPI.properties.getAllItemsOfType(modelID, ifcType, false);
  }

  return buildClassInstancesFromExpressIDs(ifcAPI, modelID, items, rdfClasses);
}

async function buildClassInstancesFromExpressIDs(ifcAPI, modelID, expressIDs, rdfClasses) {
  const graph = [];

  for (let i = 0; i < expressIDs.length; i++) {
    const expressID = expressIDs[i];
    const {
      GlobalId
    } = await ifcAPI.properties.getItemProperties(modelID, expressID);
    const URI = (0, _uriBuilder.defaultURIBuilder)(GlobalId.value); // Push spaces

    graph.push({
      "@id": URI,
      "@type": rdfClasses
    });
  }

  return graph;
}

function getElementSubtypes(type) {
  let subTypes = []; // Get the tree node that corresponds to the requested type

  const treeNode = searchProductTree(_IfcTypesTree.IfcTypesTree, type);

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


  function collectAllIds(node, ids = []) {
    ids.push(node.id);

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        collectAllIds(node.children[i], ids);
      }
    }
  }
}
//# sourceMappingURL=class-assignment.js.map