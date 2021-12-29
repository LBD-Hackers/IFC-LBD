import * as WebIFC from 'web-ifc/web-ifc-api';

interface JSONLD {
    "@context": any;
    "@graph": any[];
}
declare enum SerializationFormat {
    NQuads = "nquads",
    JSONLD = "jsonld"
}

declare class LBDParser {
    ifcApi: WebIFC.IfcAPI;
    format: SerializationFormat;
    constructor(format?: SerializationFormat);
    setWasmPath(path: string): void;
    parseBOTTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseProductTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseFSOTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
}

export { LBDParser };
