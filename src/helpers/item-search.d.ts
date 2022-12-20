import { IfcAPI } from 'web-ifc';
export declare function getAllItemsOfTypeOrSubtype(ifcAPI: IfcAPI, modelID: number, ifcType: number): Promise<number[]>;
export declare function getItemSubtypes(type: number): number[];
