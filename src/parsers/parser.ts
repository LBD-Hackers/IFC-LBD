import { JSONLD, ParserSettings, SerializationFormat } from "../helpers/BaseDefinitions";
import { IfcAPI } from 'web-ifc';
import { prefixes } from '../helpers/prefixes';
import jsonld from "jsonld";
import { IfcUnits } from '../helpers/unit-tools';

export interface ModelUnits{
    LENGTHUNIT: number;
    AREAUNIT: number;
    VOLUMEUNIT: number;
}
export class Parser{

    public jsonLDObject: JSONLD = {"@context": prefixes, "@graph": []};

    public modelID: number;
    public ifcAPI: IfcAPI;
    public verbose: boolean;
    public format: SerializationFormat;

    public modelUnits: ModelUnits; // Model units

    private globalIdMap: any = {}; // Object that maintains idMap between expressID and GlobalId

    constructor(ifcAPI: IfcAPI, modelID: number, settings: ParserSettings){
        this.modelID = modelID;
        this.ifcAPI = ifcAPI;
        this.verbose = settings.verbose;
        this.format = settings.outputFormat;
        this.setNamespace(settings.namespace);
    }

    public async getGlobalId(expressID: number){
        if(!this.idMapIncludes(expressID)){
            const { GlobalId} = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);
            this.storeGlobalId(expressID, GlobalId.value);
            return GlobalId.value;
        }else{
            return this.globalIdMap[expressID];
        }
    }

    public storeGlobalId(expressID: number, globalId: string){
        this.globalIdMap[expressID] = globalId;
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

    public async getUnits(): Promise<ModelUnits>{

        if(this.modelUnits == undefined){
            const ifcUnits = new IfcUnits(this.ifcAPI);
            this.modelUnits = await ifcUnits.getUnitsOfModel(this.modelID);
        }

        return this.modelUnits;
    }

    // Should take an IFC nominal value and convert it to a normalized one
    public normalizeMeasurement(){

    }

    private idMapIncludes(expressID: number){
        if(this.globalIdMap == undefined) return false;
        return Object.keys(this.globalIdMap).indexOf(expressID.toString()) != -1;
    }

    private async getJSONLD(): Promise<JSONLD>{
        return this.jsonLDObject;
    }

    private async getNQuads(): Promise<any>{
        return await jsonld.canonize(this.jsonLDObject);
    }

    private setNamespace(ns: string){
        this.jsonLDObject["@context"]["@base"] = ns;
        this.jsonLDObject["@context"].inst = ns;
    }

}