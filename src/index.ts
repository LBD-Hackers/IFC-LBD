import { IfcAPI } from 'web-ifc';
import { BOTParser } from "./parsers/bot-parser";
import { ProductParser } from "./parsers/product-parser";
import { PropertyParser } from "./parsers/property-parser";
import { CLITool } from "./cli-tool";
import { JSONLD, SerializationFormat } from "./helpers/BaseDefinitions";
import { FSOParser } from "./parsers/fso-parser";
import { TSOParser } from "./parsers/tso-parser";

export class LBDParser{

    // initialize the API
    public ifcApi: IfcAPI = new IfcAPI();
    
    public format: SerializationFormat;

    constructor(format: SerializationFormat = SerializationFormat.JSONLD){
        this.format = format;
    }

    public setWasmPath(path: string){
        this.ifcApi.SetWasmPath(path);
    }

    public async parseBOTTriples(ifcApi: IfcAPI, modelID: number, verbose: boolean = false): Promise<JSONLD|string>{
        const botParser = new BOTParser(ifcApi, modelID, this.format, verbose);
        return await botParser.doParse();
    }

    public async parseProductTriples(ifcApi: IfcAPI, modelID: number, verbose: boolean = false): Promise<JSONLD|string>{
        const productParser = new ProductParser(ifcApi, modelID, this.format, verbose);
        return await productParser.doParse();
    }

    public async parsePropertyTriples(ifcApi: IfcAPI, modelID: number, verbose: boolean = false): Promise<JSONLD|string>{
        const productParser = new PropertyParser(ifcApi, modelID, this.format, verbose);
        return await productParser.doParse();
    }

    public async parseFSOTriples(ifcApi: IfcAPI, modelID: number, verbose: boolean = false): Promise<JSONLD|string>{
        const fsoParser = new FSOParser(ifcApi, modelID, this.format, verbose);
        return await fsoParser.doParse();
    }

    public async parseTSOTriples(ifcApi: IfcAPI, modelID: number, verbose: boolean = false): Promise<JSONLD|string>{
        const tsoParser = new TSOParser(ifcApi, modelID, this.format, verbose);
        return await tsoParser.doParse();
    }

}