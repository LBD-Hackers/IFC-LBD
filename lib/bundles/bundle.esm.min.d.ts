import * as WebIFC$1 from 'web-ifc';
import * as WebIFC from 'web-ifc/web-ifc-api.js';

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

declare function getAllItemsOfTypeOrSubtype(ifcAPI: WebIFC.IfcAPI, modelID: number, ifcType: number): Promise<number[]>;
declare function getItemSubtypes(type: number): number[];

declare const itemSearch_d_getAllItemsOfTypeOrSubtype: typeof getAllItemsOfTypeOrSubtype;
declare const itemSearch_d_getItemSubtypes: typeof getItemSubtypes;
declare namespace itemSearch_d {
  export {
    itemSearch_d_getAllItemsOfTypeOrSubtype as getAllItemsOfTypeOrSubtype,
    itemSearch_d_getItemSubtypes as getItemSubtypes,
  };
}

declare class Input {
    ifcAPI: WebIFC.IfcAPI;
    modelID: number;
    ifcRelationship: number;
    ifcSubjectRel: string;
    ifcTargetRel: string;
    rdfRelationship?: string;
    oppoiteRelationship?: string;
    ifcSubjectClassIn?: number[];
    ifcTargetClassIn?: number[];
    includeInterface?: boolean;
}
declare function buildRelOneToOne(d: Input): Promise<any>;
declare function buildRelOneToMany(d: Input): Promise<any>;

type pathSearch_d_Input = Input;
declare const pathSearch_d_Input: typeof Input;
declare const pathSearch_d_buildRelOneToOne: typeof buildRelOneToOne;
declare const pathSearch_d_buildRelOneToMany: typeof buildRelOneToMany;
declare namespace pathSearch_d {
  export {
    pathSearch_d_Input as Input,
    pathSearch_d_buildRelOneToOne as buildRelOneToOne,
    pathSearch_d_buildRelOneToMany as buildRelOneToMany,
  };
}

declare function defaultURIBuilder(globalId: string): string;

declare const uriBuilder_d_defaultURIBuilder: typeof defaultURIBuilder;
declare namespace uriBuilder_d {
  export {
    uriBuilder_d_defaultURIBuilder as defaultURIBuilder,
  };
}

//# sourceMappingURL=index.d.ts.map

type index_d_ParserSettings = ParserSettings;
declare const index_d_ParserSettings: typeof ParserSettings;
type index_d_PropertiesSettings = PropertiesSettings;
declare const index_d_PropertiesSettings: typeof PropertiesSettings;
type index_d_FSOSettings = FSOSettings;
declare const index_d_FSOSettings: typeof FSOSettings;
type index_d_JSONLD = JSONLD;
type index_d_TreeNode = TreeNode;
type index_d_SerializationFormat = SerializationFormat;
declare const index_d_SerializationFormat: typeof SerializationFormat;
type index_d_Mimetype = Mimetype;
declare const index_d_Mimetype: typeof Mimetype;
type index_d_N3Format = N3Format;
declare const index_d_N3Format: typeof N3Format;
type index_d_Triple = Triple;
type index_d_TripleItem = TripleItem;
declare namespace index_d {
  export {
    itemSearch_d as itemSearch,
    pathSearch_d as pathSearch,
    uriBuilder_d as uriBuilder,
    index_d_ParserSettings as ParserSettings,
    index_d_PropertiesSettings as PropertiesSettings,
    index_d_FSOSettings as FSOSettings,
    index_d_JSONLD as JSONLD,
    index_d_TreeNode as TreeNode,
    index_d_SerializationFormat as SerializationFormat,
    index_d_Mimetype as Mimetype,
    index_d_N3Format as N3Format,
    index_d_Triple as Triple,
    index_d_TripleItem as TripleItem,
  };
}

declare class LBDParser {
    ifcApi: WebIFC$1.IfcAPI;
    settings: ParserSettings;
    constructor(settings?: ParserSettings);
    setWasmPath(path: string): void;
    parseBOTTriples(ifcApi: WebIFC$1.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseProductTriples(ifcApi: WebIFC$1.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parsePropertyTriples(ifcApi: WebIFC$1.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseFSOTriples(ifcApi: WebIFC$1.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
    parseTSOTriples(ifcApi: WebIFC$1.IfcAPI, modelID: number, verbose?: boolean): Promise<JSONLD | string>;
}

export { FSOSettings, JSONLD, LBDParser, Mimetype, N3Format, ParserSettings, PropertiesSettings, SerializationFormat, TreeNode, Triple, TripleItem, index_d as helpers };
