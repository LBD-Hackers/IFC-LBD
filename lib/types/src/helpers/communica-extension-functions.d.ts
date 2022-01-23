import type * as RDF from '@rdfjs/types';
export declare const extensionFunctions: {
    'http://example.org/functions#to-upper-case'(args: RDF.Term[]): RDF.BaseQuad | RDF.NamedNode<string> | RDF.BlankNode | RDF.Variable | RDF.DefaultGraph | import("rdf-data-factory").Literal;
    'http://example.org/functions#get-id'(args: RDF.Term[]): RDF.BaseQuad | RDF.BlankNode | RDF.Variable | RDF.DefaultGraph | import("rdf-data-factory").Literal;
    'http://example.org/functions#get-namespace'(args: RDF.Term[]): RDF.BaseQuad | RDF.BlankNode | RDF.Variable | RDF.DefaultGraph | import("rdf-data-factory").Literal;
    'http://example.org/functions#uri-concat'(args: RDF.Term[]): import("rdf-data-factory").Literal | import("rdf-data-factory").NamedNode<string>;
    'http://www.opengis.net/def/function/geosparql/distance'(args: RDF.Term[]): import("rdf-data-factory").Literal;
};
//# sourceMappingURL=communica-extension-functions.d.ts.map