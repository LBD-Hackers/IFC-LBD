export interface JSONLD{
    "@context": any,
    "@graph": any[]
}

export interface TreeNode{
    "name": string;
    "id": number;
    "children"?: TreeNode[];
}

export enum SerializationFormat{
    NQuads="nquads",
    JSONLD="jsonld"
}

export enum Mimetype{
    NTriples="application/n-triples",
    Turtle="text/turtle",
    NQuads="application/n-quads",
    Trig="application/trig",
    SPARQLJSON="application/sparql-results+json",
    JSONLD="application/ld+json",
    DLOG="application/x.datalog"
}

export enum N3Format{
    NTriples="N-Triples",
    Trig="application/trig",
    NQuads="N-Quads",
    Turtle="Turtle"
}

export interface Triple{
    subject: TripleItem,
    predicate: TripleItem,
    object: TripleItem,
    graph: TripleItem
}

export interface TripleItem{
    termType: string;
    value: string;
}