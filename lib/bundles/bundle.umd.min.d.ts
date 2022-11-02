import * as WebIFC from 'web-ifc';

declare class ParserSettings {
    format: SerializationFormat;
    properties: PropertiesSettings;
    fso: FSOSettings;
}
declare class PropertiesSettings {
    normalizeToSI: boolean;
    includePSetProperties: boolean;
}
declare class FSOSettings {
    normalizeToSI: boolean;
}
interface JSONLD {
    "@context": any;
    "@graph": any[];
}
interface TreeNode {
    "name": string;
    "id": number;
    "children"?: TreeNode[];
}
declare enum SerializationFormat {
    NQuads = "nquads",
    JSONLD = "jsonld"
}
declare enum Mimetype {
    NTriples = "application/n-triples",
    Turtle = "text/turtle",
    NQuads = "application/n-quads",
    Trig = "application/trig",
    SPARQLJSON = "application/sparql-results+json",
    JSONLD = "application/ld+json",
    DLOG = "application/x.datalog"
}
declare enum N3Format {
    NTriples = "N-Triples",
    Trig = "application/trig",
    NQuads = "N-Quads",
    Turtle = "Turtle"
}
interface Triple {
    subject: TripleItem;
    predicate: TripleItem;
    object: TripleItem;
    graph: TripleItem;
}
interface TripleItem {
    termType: string;
    value: string;
}

declare class LBDParser {
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

export { FSOSettings, JSONLD, LBDParser, Mimetype, N3Format, ParserSettings, PropertiesSettings, SerializationFormat, TreeNode, Triple, TripleItem };
