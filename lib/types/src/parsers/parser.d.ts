import { JSONLD, SerializationFormat } from "../helpers/BaseDefinitions";
import * as WebIFC from "web-ifc/web-ifc-api.js";
import * as N3 from 'n3';
export declare class Parser {
    jsonLDObject: JSONLD;
    modelID: number;
    ifcAPI: WebIFC.IfcAPI;
    verbose: boolean;
    format: SerializationFormat;
    communicaEngine: import("@comunica/actor-init-sparql/lib/ActorInitSparql-browser").ActorInitSparql;
    store: N3.Store;
    constructor(ifcAPI: WebIFC.IfcAPI, modelID: number, format?: SerializationFormat, verbose?: boolean);
    getTriples(): Promise<JSONLD | string>;
    getTripleCount(): Promise<number>;
    loadInStore(): Promise<void>;
    executeUpdateQuery(query: string): Promise<void>;
    executeSelectQuery(query: string): Promise<void>;
    getStoreSize(): number;
    private getJSONLD;
    private getNQuads;
    private serializeStoreContent;
}
//# sourceMappingURL=parser.d.ts.map