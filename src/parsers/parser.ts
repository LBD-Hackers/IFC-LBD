import { JSONLD, N3Format, ParserSettings, SerializationFormat } from "../helpers/BaseDefinitions";
import * as WebIFC from "web-ifc";
import { prefixes } from '../helpers/prefixes';
import { extensionFunctions } from '../helpers/communica-extension-functions';
import { toRDF, fromRDF, compact } from "jsonld";
import * as N3 from 'n3';
import { QueryEngine } from '@comunica/query-sparql';
import { geoSPARQLFunctions } from "comunica-geosparql/lib/bundles/bundle.umd";
import { IfcUnits } from '../helpers/unit-tools';

export interface ModelUnits{
    LENGTHUNIT: number;
    AREAUNIT: number;
    VOLUMEUNIT: number;
}
export class Parser{

    public jsonLDObject: JSONLD = {"@context": prefixes, "@graph": []};

    public modelID: number;
    public ifcAPI: WebIFC.IfcAPI;
    public verbose: boolean;
    public settings: ParserSettings;
    public store: N3.Store = new N3.Store();
    public extensionFunctions = {...extensionFunctions, ...geoSPARQLFunctions};

    public modelUnits: ModelUnits; // Model units

    private globalIdMap: any = {}; // Object that maintains idMap between expressID and GlobalId

    constructor(ifcAPI: WebIFC.IfcAPI, modelID: number, settings: ParserSettings, verbose: boolean = false){
        this.modelID = modelID;
        this.ifcAPI = ifcAPI;
        this.verbose = verbose;
        this.settings = settings;
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
        if(this.settings.format == SerializationFormat.JSONLD) return this.getJSONLD();
        if(this.settings.format == SerializationFormat.NQuads) return this.getNQuads();
        return "";
    }

    public async getTripleCount(): Promise<number>{
        if(this.store.size > 0){
            return this.getStoreSize();
        }
        const rdf: any = await toRDF(this.jsonLDObject);
        const tripleCount = rdf.length;
        return tripleCount;
    }

    public async loadInStore(): Promise<void>{
        const quads: any = await toRDF(this.jsonLDObject);
        await this.store.addQuads(quads);
    }

    public async executeUpdateQuery(query: string): Promise<void>{
        const engine = new QueryEngine();
        await engine.queryVoid(query, {
            sources: [this.store],
            extensionFunctions: this.extensionFunctions
        });
    }

    public async executeSelectQuery(query: string): Promise<void>{
        // Initiate the update
        const engine = new QueryEngine();
        console.log(engine);
        const result: any = await engine.queryBindings(query, {
            sources: [this.store],
            extensionFunctions: this.extensionFunctions
        });
        
        const { data } = await engine.resultToString(result,
            'application/sparql-results+json');
        data.pipe(process.stdout); // Print to standard output
    }

    public getStoreSize(): number{
        return this.store.size;
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
        // If store is up, serialize the content of the store
        if(this.store.size > 0){
            const nquads = this.store.getQuads(null, null, null, null);
            const doc = await fromRDF(nquads);
            const compacted = await compact(doc, this.jsonLDObject["@context"]);
            return compacted as JSONLD;
        }
        // If not, simply return the JSON-LD object
        return this.jsonLDObject;
    }

    private async getNQuads(): Promise<any>{
        // If store is up, serialize the content of the store
        if(this.store.size > 0){
            return await this.serializeStoreContent(N3Format.NQuads);
        }
        // If not, simply convert the JSON-LD object
        return await toRDF(this.jsonLDObject, {format: 'application/n-quads'});
    }

    private async serializeStoreContent(format: N3Format = N3Format.Turtle): Promise<string>{

        return new Promise((resolve, reject) => {

            const writer = new N3.Writer({ prefixes: prefixes, format });
            const quads = this.store.getQuads(null, null, null, null);

            for (let i = 0; i < quads.length; i++) {
                writer.addQuad(quads[i]);
            }

            writer.end((error, result) => {
                if(error) reject(error);
                resolve(result);
            });

        })
        
    }

}