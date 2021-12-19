import { JSONLD, SerializationFormat } from "../helpers/BaseDefinitions";
import * as WebIFC from "web-ifc/web-ifc-api.js";
import * as jsonld from "jsonld";

export class Parser{

    public jsonLDObject: JSONLD = {"@context": {
        "bot": "https://w3id.org/bot#",
        "fso": "https://w3id.org/fso#",
        "omg": "https://w3id.org/omg#",
        "fog": "https://w3id.org/fog#",
        "ex": "https://example.com/",
        "ifc": "http://ifcowl.openbimstandards.org/IFC2X3_Final#",
        "inst": "https://example.com/"
    }, "@graph": []};

    public modelID: number;
    public ifcAPI: WebIFC.IfcAPI;
    public verbose: boolean;
    public format: SerializationFormat;

    constructor(ifcAPI: WebIFC.IfcAPI, modelID: number, format: SerializationFormat = SerializationFormat.JSONLD, verbose: boolean = false){
        this.modelID = modelID;
        this.ifcAPI = ifcAPI;
        this.verbose = verbose;
        this.format = format;
    }

    public async getTriples(): Promise<JSONLD|string>{
        if(this.format == SerializationFormat.JSONLD) return this.getJSONLD();
        if(this.format == SerializationFormat.NQuads) return this.getNQuads();
        return "";
    }

    public async getTripleCount(): Promise<number>{
        const rdf: any = await jsonld.toRDF(this.jsonLDObject);
        const tripleCount = rdf.length;
        return tripleCount;
    }

    private getJSONLD(): JSONLD{
        return this.jsonLDObject;
    }

    private async getNQuads(): Promise<any>{
        return await jsonld.toRDF(this.jsonLDObject, {format: 'application/n-quads'});
    }

}