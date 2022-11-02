import * as WebIFC from "web-ifc";
import { JSONLD, ParserSettings } from "./helpers/BaseDefinitions";
export * from "./helpers/BaseDefinitions";
export declare class LBDParser {
    ifcApi: WebIFC.IfcAPI;
    settings: ParserSettings;
    constructor(settings?: ParserSettings);
    setWasmPath(path: string): void;
    parseBOTTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseProductTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parsePropertyTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseFSOTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseTSOTriples(ifcApi: WebIFC.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
}
//# sourceMappingURL=index.d.ts.map