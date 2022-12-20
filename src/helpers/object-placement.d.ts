import { IfcLocalPlacement } from "web-ifc";
export declare function getGlobalRotation(objectPlacement: IfcLocalPlacement): void;
/**
 * Return the global position (coordinate) from the local one
 * @param objectPlacement is the object placement in the local coordinate system
 * @param globalPlacement is the global placement (being calculated as the tree is traversed)
 * @returns global coordinate
 */
export declare function getGlobalPosition(objectPlacement: any, globalPlacement?: number[]): number[];
