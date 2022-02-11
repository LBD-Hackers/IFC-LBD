import * as WebIFC from "web-ifc/web-ifc-api";
import { JSONLD, SerializationFormat } from "./helpers/BaseDefinitions";
export declare class LBDParser {
    ifcApi: WebIFC.IfcAPI;
    format: SerializationFormat;
    constructor(format?: SerializationFormat);
    setWasmPath(path: string): void;
    parseBOTTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseProductTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parsePropertyTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseFSOTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseTSOTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
}
//# sourceMappingURL=index.d.ts.map