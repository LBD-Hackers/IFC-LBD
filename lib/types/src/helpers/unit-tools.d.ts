import * as WebIFC from "web-ifc/web-ifc-api.js";
export declare enum UnitType {
    LENGTHUNIT = "LENGTHUNIT",
    AREAUNIT = "AREAUNIT",
    VOLUMEUNIT = "VOLUMEUNIT"
}
export declare const UnitScale: {
    [unit: string]: number;
};
export declare const ucumPrefix: {
    [unit: string]: string;
};
export declare function getUCUMCode(unitType: UnitType, multiplicationFactor: number): string;
export declare class IfcUnits {
    allUnits: {
        [modelID: number]: any;
    };
    private ifcAPI;
    constructor(ifcAPI: WebIFC.IfcAPI);
    getUnits(modelID: number, type: UnitType): Promise<any>;
    getUnitsOfModel(modelID: number): Promise<any>;
}
//# sourceMappingURL=unit-tools.d.ts.map