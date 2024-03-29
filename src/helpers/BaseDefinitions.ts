export interface JSONLD{
    "@context": any,
    "@graph": any[]
}

export interface TreeNode{
    "name": string;
    "id": number;
    "children"?: TreeNode[];
}

export class ParserSettings{
    namespace: string = "https://web-bim/resources/";
    subsets: Subsets = new Subsets();
    outputFormat: SerializationFormat = SerializationFormat.JSONLD;
    normalizeToSIUnits: boolean = true;
    verbose: boolean = false;
}

export class Subsets{
    BOT: boolean = true;
    PROPERTIES: boolean = true;
    PRODUCTS: boolean = true;
    FSO: boolean = false;
    // interfaces: boolean = true;
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