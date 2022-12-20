import { IfcAPI } from 'web-ifc';
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
    constructor(ifcAPI: IfcAPI);
    getUnits(modelID: number, type: UnitType): Promise<any>;
    getUnitsOfModel(modelID: number): Promise<any>;
}
