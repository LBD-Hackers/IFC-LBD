import { JSONLD } from "../helpers/BaseDefinitions";
import * as WebIFC from "web-ifc/web-ifc-api.js";

export class Parser{

    public jsonLDObject: JSONLD = {"@context": {
        "bot": "https://w3id.org/bot#",
        "ex": "https://example.com/",
        "ifc": "http://ifcowl.openbimstandards.org/IFC2X3_Final#",
        "inst": "https://example.com/"
    }, "@graph": []};

    public modelID: number;
    public ifcAPI: WebIFC.IfcAPI;

    constructor(ifcAPI: WebIFC.IfcAPI, modelID: number){
        console.log("Initializing BOT Parser");
        this.modelID = modelID;
        this.ifcAPI = ifcAPI;
    }

    public getJSONLD(){
        return this.jsonLDObject;
    }

}