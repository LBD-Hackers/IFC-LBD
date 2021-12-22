"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalPosition = getGlobalPosition;
exports.getGlobalRotation = getGlobalRotation;

function getGlobalRotation(objectPlacement) {
  // Get relative placement
  console.log("Relative placement");
  console.log(objectPlacement.RelativePlacement); // console.log(Object.keys(objectPlacement));
  // console.log(objectPlacement);
}
/**
 * Return the global position (coordinate) from the local one
 * @param objectPlacement is the object placement in the local coordinate system
 * @param globalPlacement is the global placement (being calculated as the tree is traversed)
 * @returns global coordinate
 */


function getGlobalPosition(objectPlacement, globalPlacement = [0, 0, 0]) {
  // Get relative placement
  const relativeCoordinates = objectPlacement?.RelativePlacement?.Location?.Coordinates;
  let relativePlacement = [];

  if (relativeCoordinates != undefined && relativeCoordinates.length == 3) {
    const x = round(relativeCoordinates[0].value);
    const y = round(relativeCoordinates[1].value);
    const z = round(relativeCoordinates[2].value);
    relativePlacement = [x, y, z];
  } // Update global placement


  globalPlacement = getAbsolutePlacement(relativePlacement, globalPlacement); // If related to something else, continue the journey

  if (objectPlacement.PlacementRelTo) {
    return getGlobalPosition(objectPlacement.PlacementRelTo, globalPlacement);
  }

  return globalPlacement;
}

function getAbsolutePlacement(relativePlacement, globalPlacement) {
  const x = relativePlacement[0] + globalPlacement[0];
  const y = relativePlacement[1] + globalPlacement[1];
  const z = relativePlacement[2] + globalPlacement[2];
  return [x, y, z];
}

function round(num) {
  return Math.round(num * 100000) / 100000;
}
//# sourceMappingURL=object-placement.js.map