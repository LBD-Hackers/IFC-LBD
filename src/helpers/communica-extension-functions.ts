import { DataFactory } from "rdf-data-factory";
import type * as RDF from '@rdfjs/types';
import { parseWKT } from "./wkt-parser";

const DF = new DataFactory();

export const extensionFunctions = {
    'http://example.org/functions#to-upper-case'(args: RDF.Term[]) {
        const arg = args[0];
        if (arg.termType === 'Literal' && arg.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
            return DF.literal(arg.value.toUpperCase(), arg.datatype);
        }
        return arg;
    },
    'http://example.org/functions#get-id'(args: RDF.Term[]) {
        const arg = args[0];
        if (arg.termType === 'NamedNode') {
            return DF.literal(getID(arg));
        }
        return arg;
    },
    'http://example.org/functions#get-namespace'(args: RDF.Term[]) {
        const arg = args[0];
        if (arg.termType === 'NamedNode') {
            return DF.literal(getNamespace(arg));
        }
        return arg;
    },
    'http://example.org/functions#uri-concat'(args: RDF.Term[]) {
        const uri1 = args[0];
        const uri2 = args[1];
        if (uri1.termType === 'NamedNode' && uri2.termType === 'NamedNode') {
              const ns = getNamespace(uri1);
              const id1 = getID(uri1);
              const id2 = getID(uri2);
              return DF.namedNode(ns + id1 + id2);
        }
        return DF.literal("ERROR");
    },

    // GEOJSON
    // geosf:distance(p1, p2, decimals)
    'http://www.opengis.net/def/function/geosparql/distance'(args: RDF.Term[]) {
        const decimals = args[2] != undefined ? parseFloat(args[2].value) : 8;
        if (args[0].termType === 'Literal' && args[1].termType === 'Literal') {
            const p1 = parseWKT(args[0].value);
            const p2 = parseWKT(args[1].value);
            
            const a = p1[0] - p2[0];
            const b = p1[1] - p2[1];
            const c = p1[2] - p2[2];

            const d: number = round(Math.sqrt(a * a + b * b + c * c), decimals);
            // if(p1.length == 2 && p2.length == 2){

            // } 

            return DF.literal(d.toString(), DF.namedNode('http://www.w3.org/2001/XMLSchema#decimal'));
        }
        return DF.literal("ERROR");
    }
}

function round(num: number, decimals: number = 0): number{
    return Math.round( num * (10 ** decimals) + Number.EPSILON ) / (10 ** decimals);
}

function getID(uri: RDF.Term){
    return uri.value.indexOf("#") != -1 ? uri.value.split("#")[1] : uri.value.split("/").pop();
}

function getNamespace(uri: RDF.Term){
    if(uri.value.indexOf("#") != -1){
        return uri.value.split("#")[0]+"#";
    }else{
        const arr = uri.value.split("/");
        arr.pop();
        return arr.join("/") + "/";
    }
}