export interface JSONLD {
    "@context": any;
    "@graph": any[];
}
export interface TreeNode {
    "name": string;
    "id": number;
    "children"?: TreeNode[];
}
export declare enum SerializationFormat {
    NQuads = "nquads",
    JSONLD = "jsonld"
}
export declare enum Mimetype {
    NTriples = "application/n-triples",
    Turtle = "text/turtle",
    NQuads = "application/n-quads",
    Trig = "application/trig",
    SPARQLJSON = "application/sparql-results+json",
    JSONLD = "application/ld+json",
    DLOG = "application/x.datalog"
}
export interface Triple {
    subject: TripleItem;
    predicate: TripleItem;
    object: TripleItem;
    graph: TripleItem;
}
export interface TripleItem {
    termType: string;
    value: string;
}
//# sourceMappingURL=BaseDefinitions.d.ts.map