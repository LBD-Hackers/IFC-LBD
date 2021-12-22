import { JSONLD, SerializationFormat } from "../helpers/BaseDefinitions";
import * as WebIFC from "web-ifc/web-ifc-api.js";
export declare class Parser {
    jsonLDObject: JSONLD;
    modelID: number;
    ifcAPI: WebIFC.IfcAPI;
    verbose: boolean;
    format: SerializationFormat;
    constructor(ifcAPI: WebIFC.IfcAPI, modelID: number, format?: SerializationFormat, verbose?: boolean);
    getTriples(): Promise<JSONLD | string>;
    getTripleCount(): Promise<number>;
    private getJSONLD;
    private getNQuads;
}
//# sourceMappingURL=parser.d.ts.map