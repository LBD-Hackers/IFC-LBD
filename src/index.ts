import { IfcAPI } from 'web-ifc';
import { BOTParser } from "./parsers/bot-parser";
import { ProductParser } from "./parsers/product-parser";
import { PropertyParser } from "./parsers/property-parser";
import { JSONLD, ParserSettings, SerializationFormat } from "./helpers/BaseDefinitions";
import { FSOParser } from "./parsers/fso-parser";
import { TSOParser } from "./parsers/tso-parser";
import { concatJSONLD } from "./helpers/json-ld-concat";

export * from "./helpers/BaseDefinitions";
export class LBDParser{

    // initialize the API
    private ifcApi: IfcAPI = new IfcAPI();
    
    private settings: ParserSettings;

    constructor(settings?: ParserSettings){
        this.settings = settings == undefined ? new ParserSettings() : settings;
    }

    public setWasmPath(path: string){
        this.ifcApi.SetWasmPath(path);
    }

    // Default method. Parses everything set in the settings
    public async parse(ifcApi: IfcAPI, modelID: number): Promise<JSONLD|string>{

        let results: any = [];

        const subsetIds = Object.keys(this.settings.subsets);

        for(let subsetId of subsetIds){
            const toBeProcessed = this.settings.subsets[subsetId];
            if(toBeProcessed){
                switch(subsetId) {
                    case "BOT":
                        console.log("Parse BOT");
                        results.push(await this.parseBOTTriples(ifcApi, modelID));
                        break;
                    case "PROPERTIES":
                        results.push(await this.parsePropertyTriples(ifcApi, modelID));
                        break;
                    case "PRODUCTS":
                        results.push(await this.parseProductTriples(ifcApi, modelID));
                        break;
                    case "FSO":
                        results.push(await this.parseFSOTriples(ifcApi, modelID));
                        break;
                    }
            }
        };

        if(this.settings.outputFormat == SerializationFormat.NQuads){
            return results.join("\n");
        }else{
            return await concatJSONLD(results);
        }

    }

    public async parseBOTTriples(ifcApi: IfcAPI, modelID: number): Promise<JSONLD|string>{
        const botParser = new BOTParser(ifcApi, modelID, this.settings);
        return await botParser.doParse();
    }

    public async parseProductTriples(ifcApi: IfcAPI, modelID: number): Promise<JSONLD|string>{
        const productParser = new ProductParser(ifcApi, modelID, this.settings);
        return await productParser.doParse();
    }

    public async parsePropertyTriples(ifcApi: IfcAPI, modelID: number): Promise<JSONLD|string>{
        const productParser = new PropertyParser(ifcApi, modelID, this.settings);
        return await productParser.doParse();
    }

    public async parseFSOTriples(ifcApi: IfcAPI, modelID: number): Promise<JSONLD|string>{
        const fsoParser = new FSOParser(ifcApi, modelID, this.settings);
        return await fsoParser.doParse();
    }

    public async parseTSOTriples(ifcApi: IfcAPI, modelID: number): Promise<JSONLD|string>{
        const tsoParser = new TSOParser(ifcApi, modelID, this.settings);
        return await tsoParser.doParse();
    }

}