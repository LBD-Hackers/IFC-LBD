import { JSONLD, SerializationFormat } from "../helpers/BaseDefinitions";
import * as WebIFC from "web-ifc/web-ifc-api.js";
import * as N3 from 'n3';
import { QueryEngine } from '@comunica/query-sparql';
export interface ModelUnits {
    LENGTHUNIT: number;
    AREAUNIT: number;
    VOLUMEUNIT: number;
}
export declare class Parser {
    jsonLDObject: JSONLD;
    modelID: number;
    ifcAPI: WebIFC.IfcAPI;
    verbose: boolean;
    format: SerializationFormat;
    communicaEngine: QueryEngine;
    store: N3.Store;
    extensionFunctions: {
        'http://www.opengis.net/def/function/geosparql/distance'(args: import("rdf-js").Term[]): import("rdf-data-factory").Literal;
        'http://www.opengis.net/def/function/geosparql/inside'(args: import("rdf-js").Term[]): import("rdf-data-factory").Literal;
        'http://example.org/functions#to-upper-case'(args: import("rdf-js").Term[]): import("rdf-js").BaseQuad | import("rdf-js").NamedNode<string> | import("rdf-js").BlankNode | import("rdf-js").Variable | import("rdf-js").DefaultGraph | import("rdf-data-factory").Literal;
        'http://example.org/functions#get-id'(args: import("rdf-js").Term[]): import("rdf-js").BaseQuad | import("rdf-js").BlankNode | import("rdf-js").Variable | import("rdf-js").DefaultGraph | import("rdf-data-factory").Literal;
        'http://example.org/functions#get-namespace'(args: import("rdf-js").Term[]): import("rdf-js").BaseQuad | import("rdf-js").BlankNode | import("rdf-js").Variable | import("rdf-js").DefaultGraph | import("rdf-data-factory").Literal;
        'http://example.org/functions#uri-concat'(args: import("rdf-js").Term[]): import("rdf-data-factory").Literal | import("rdf-data-factory").NamedNode<string>;
    };
    modelUnits: ModelUnits;
    private globalIdMap;
    constructor(ifcAPI: WebIFC.IfcAPI, modelID: number, format?: SerializationFormat, verbose?: boolean);
    getGlobalId(expressID: number): Promise<any>;
    storeGlobalId(expressID: number, globalId: string): void;
    getTriples(): Promise<JSONLD | string>;
    getTripleCount(): Promise<number>;
    loadInStore(): Promise<void>;
    executeUpdateQuery(query: string): Promise<void>;
    executeSelectQuery(query: string): Promise<void>;
    getStoreSize(): number;
    getUnits(): Promise<ModelUnits>;
    normalizeMeasurement(): void;
    private idMapIncludes;
    private getJSONLD;
    private getNQuads;
    private serializeStoreContent;
}
//# sourceMappingURL=parser.d.ts.map