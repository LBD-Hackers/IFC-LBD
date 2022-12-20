import { IfcAPI } from 'web-ifc';
import { JSONLD, SerializationFormat } from "./helpers/BaseDefinitions";
export declare class LBDParser {
    ifcApi: IfcAPI;
    format: SerializationFormat;
    constructor(format?: SerializationFormat);
    setWasmPath(path: string): void;
    parseBOTTriples(ifcApi: IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseProductTriples(ifcApi: IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parsePropertyTriples(ifcApi: IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseFSOTriples(ifcApi: IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseTSOTriples(ifcApi: IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
}
