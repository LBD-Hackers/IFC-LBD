"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRelOneToMany = buildRelOneToMany;
exports.buildRelOneToOne = buildRelOneToOne;

var _uriBuilder = require("./uri-builder");

async function buildRelOneToOne(ifcAPI, modelID = 0, relationshipType, subjectRef, targetRef, rdfRelationship, includeInterface = false, biderectional = false) {
  const graph = [];
  const rels = await ifcAPI.properties.getAllItemsOfType(modelID, relationshipType, false);

  for (let i = 0; i < rels.length; i++) {
    const relID = rels[i];
    const relProps = await ifcAPI.properties.getItemProperties(modelID, relID); // Only continue if the interface is between an element and a space

    if (!relProps[subjectRef] || !relProps[targetRef]) {
      continue;
    } // Get properties of related and relating


    const [subject, target] = await Promise.all([ifcAPI.properties.getItemProperties(modelID, relProps[subjectRef].value), ifcAPI.properties.getItemProperties(modelID, relProps[targetRef].value)]);
    const subjectURI = (0, _uriBuilder.defaultURIBuilder)(subject.GlobalId.value);
    const targetURI = (0, _uriBuilder.defaultURIBuilder)(target.GlobalId.value);
    const interfaceURI = (0, _uriBuilder.defaultURIBuilder)(relProps.GlobalId.value); // Push relationships

    graph.push({
      "@id": subjectURI,
      [rdfRelationship]: {
        "@id": targetURI
      }
    }); // Optionally, push it in opposite direction

    if (biderectional) {
      graph.push({
        "@id": targetURI,
        [rdfRelationship]: {
          "@id": subjectURI
        }
      });
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
  }

  return graph;
}

async function buildRelOneToMany(ifcAPI, modelID = 0, relationshipType, subjectRef, targetRef, rdfRelationship, subjectClassConstraint, targetClassConstraint) {
  const graph = [];
  const rels = await ifcAPI.properties.getAllItemsOfType(modelID, relationshipType, false);

  for (let i = 0; i < rels.length; i++) {
    const relID = rels[i];
    const relProps = await ifcAPI.properties.getItemProperties(modelID, relID); // Only continue if the interface is between an element and a space

    if (!relProps[subjectRef] || !relProps[targetRef]) {
      continue;
    }

    const subject = await ifcAPI.properties.getItemProperties(modelID, relProps[subjectRef].value); // It might be that we are only interested in relationship where the subject fulfills the constraint

    if (subjectClassConstraint && subject.type != subjectClassConstraint) {
      continue;
    }

    const targetPromises = [];

    for (let i = 0; i < relProps[targetRef].length; i++) {
      targetPromises.push(ifcAPI.properties.getItemProperties(modelID, relProps[targetRef][i].value));
    }

    const targets = await Promise.all(targetPromises);
    const targetObjects = targets.filter(t => {
      // It might be that we are only interested in relationship where the target fulfills the constraint
      if (targetClassConstraint && t.type != targetClassConstraint) return false;
      return true;
    }).map(t => {
      const targetURI = (0, _uriBuilder.defaultURIBuilder)(t.GlobalId.value);
      return {
        "@id": targetURI
      };
    }); // Skip if no target objects

    if (!targetObjects.length) {
      continue;
    }

    const subjectURI = (0, _uriBuilder.defaultURIBuilder)(subject.GlobalId.value); // Push relationships

    graph.push({
      "@id": subjectURI,
      [rdfRelationship]: targetObjects
    });
  }

  return graph;
}
//# sourceMappingURL=path-search.js.map