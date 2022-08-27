import { IfcAPI } from 'web-ifc/web-ifc-api.js';
import { ModelUnits } from "../parsers/parser";
export declare class Input {
    ifcAPI: IfcAPI;
    modelID: number;
    modelUnits: ModelUnits;
    normalizeToSI: boolean;
}
export declare class PropertyAPI {
    private ifcAPI;
    private modelID;
    private normalizeToSI;
    private modelUnits;
    psetNames: string[];
    psetProperties: any;
    quantityProperties: any;
    constructor(d: Input);
    getAllProperties(verbose?: boolean): Promise<any>;
    getPSets(): any[];
    getElementQuantities(): any[];
    private processPropertyDefinition;
    private processQuantityProperty;
    private processPSetProperty;
    private nominalValueToJSONLD;
    private camelize;
    private pascalize;
}
//# sourceMappingURL=properties.d.ts.map