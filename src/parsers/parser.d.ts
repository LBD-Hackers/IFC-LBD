import { JSONLD, SerializationFormat } from "../helpers/BaseDefinitions";
import { IfcAPI } from 'web-ifc';
import * as N3 from 'n3';
export interface ModelUnits {
    LENGTHUNIT: number;
    AREAUNIT: number;
    VOLUMEUNIT: number;
}
export declare class Parser {
    jsonLDObject: JSONLD;
    modelID: number;
    ifcAPI: IfcAPI;
    verbose: boolean;
    format: SerializationFormat;
    store: N3.Store;
    modelUnits: ModelUnits;
    private globalIdMap;
    constructor(ifcAPI: IfcAPI, modelID: number, format?: SerializationFormat, verbose?: boolean);
    getGlobalId(expressID: number): Promise<any>;
    storeGlobalId(expressID: number, globalId: string): void;
    getTriples(): Promise<JSONLD | string>;
    getTripleCount(): Promise<number>;
    loadInStore(): Promise<void>;
    executeUpdateQuery(query: string): Promise<void>;
    getStoreSize(): number;
    getUnits(): Promise<ModelUnits>;
    normalizeMeasurement(): void;
    private idMapIncludes;
    private getJSONLD;
    private getNQuads;
    private serializeStoreContent;
}
