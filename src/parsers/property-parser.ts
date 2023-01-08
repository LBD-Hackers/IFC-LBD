import {
    IFCDISTRIBUTIONPORT,
    IFCGROUP,
    IFCPORT,
    IFCPRODUCT
} from 'web-ifc';
import { ModelUnits, Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { getAllItemsOfTypeOrSubtype } from "../helpers/item-search";
import { defaultURIBuilder } from '../helpers/uri-builder';
import { decodeString } from '../helpers/character-decode';
import { Input, PropertyAPI } from '../helpers/properties';
import { ProgressTracker } from '../helpers/progress-tracker';

// Thoughts
// - We should probably have a list of known IFC property sets and properties that we can match against

export class PropertyParser extends Parser{

    public itemIDs: number[];    // Holds expressIDs for all relevant items
    public modelUnits: ModelUnits;

    public psetNames: string[] = [];    // Holds all property set names found in model
    public psetProperties: any = {};    // Holds the properties that exist in each property set. Key = psetName

    public progressTracker = new ProgressTracker()

    public async doParse(normalizeToSI: boolean = true): Promise<string>{

        this.verbose && console.log("Started PROPERTIES parsing");
        this.verbose && console.log("");
        console.time("Finished PROPERTIES parsing");

        this.verbose && console.log("## PRE STEPS ##");
        this.verbose && console.time("Getting element and group IDs");
        this.itemIDs = await this.getAllRelevantItems();
        this.verbose && console.timeEnd("Getting element and group IDs");
        this.verbose && console.time("Getting model units");
        this.modelUnits = await this.getUnits();
        this.verbose && console.timeEnd("Getting model units");

        // Works on a stringified version of the full graph. Stringified because it is too large to handle as an array
        let graphStr = "[";

        this.verbose && console.log("## STEP 1: DIRECT PROPERTIES ##");
        this.verbose && console.time("1/3: Found direct properties");
        graphStr+= await this.getElementProperties();
        this.verbose && console.timeEnd("1/3: Found direct properties");
        console.log("");

        const input: Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            normalizeToSI,
            modelUnits: this.modelUnits
        }
        const propertyAPI = new PropertyAPI(input);

        this.verbose && console.log("## STEP 2: PSET PROPERTIES ##");
        this.verbose && console.time("2/3: Found pset properties");
        graphStr+= await propertyAPI.getAllProperties(this.verbose);
        this.verbose && console.timeEnd("2/3: Found pset properties");
        console.log("");

        this.verbose && console.log("## STEP 3: WRITE PROPERTY SETS ##");
        this.verbose && console.time("3/3: Writing the property sets themselves (TBox)");
        graphStr+= await propertyAPI.getPSets();
        graphStr+= await propertyAPI.getElementQuantities();
        this.verbose && console.timeEnd("3/3: Writing the property sets themselves (TBox)");
        console.log("");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        graphStr = graphStr.slice(0, -1) //Remove tailing comma
        graphStr+= "]"; // Close list

        this.jsonLDObject["@graph"] = JSON.parse(graphStr);

        return await this.getTriples();

    }

    async getAllRelevantItems(): Promise<number[]>{
        let arr: any[] = [];
        arr.push(...await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCPRODUCT));   // Elements, spaces etc.
        arr.push(...await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCGROUP));     // Systems etc.
        return arr;
    }

    /**
     * DIRECT
     * Returns a stringified version of a list
     */
    async getElementProperties(): Promise<string>{

        // Subscribe to progress in current event
        if(this.verbose){
            this.progressTracker.getProgress(this.itemIDs.length).subscribe(progress => {
                console.log(progress);
            });
        }

        // Reset counter
        this.progressTracker.resetProcessedCount();

        const propertyPromises: any[] = [];
        for (let i = 0; i < this.itemIDs.length; i++) {
            const expressID = this.itemIDs[i];
            propertyPromises.push(this.buildDirectProperties(expressID, this.progressTracker));
        }

        // Remove "[" and "]" and add "," so next item can be appended directly
        let arrStr = JSON.stringify(await Promise.all(propertyPromises));
        arrStr = arrStr.substring(1);
        arrStr = arrStr.slice(0, -1);
        arrStr+= ",";

        return arrStr;

    }

    private async buildDirectProperties(expressID: number, progressTracker?: ProgressTracker): Promise<any>{

        const properties = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

        // Example
        // IfcCooledBeam {
        //     expressID: 2701,
        //     type: 4136498852,
        //     GlobalId: { type: 1, value: '0MMKrFmIr4b8IaMYvCQ0YS' },
        //     OwnerHistory: { type: 5, value: 42 },
        //     Name: {
        //       type: 1,
        //       value: 'DID642-4-S2-RR-AV 1200x900-593 158 158 LE - TROX Technik (DEU) #s8hqpa4#:Standard:7295696'
        //     },
        //     Description: null,
        //     ObjectType: {
        //       type: 1,
        //       value: 'DID642-4-S2-RR-AV 1200x900-593 158 158 LE - TROX Technik (DEU) #s8hqpa4#:Standard'
        //     },
        //     ObjectPlacement: { type: 5, value: 2699 },
        //     Representation: { type: 5, value: 2689 },
        //     Tag: { type: 1, value: '7295696' },
        //     PredefinedType: { type: 3, value: 'ACTIVE' }
        //   }
        
        const name = properties.Name?.value;
        const globalId = properties.GlobalId.value;
        this.storeGlobalId(expressID, globalId);    // Store the global id now that we have it (so it is directly available next time)
        const description = properties.Description?.value;

        const URI = defaultURIBuilder(globalId);

        let obj = {"@id": URI, "ex:globalId": globalId};

        if(name != undefined) obj["rdfs:label"] = decodeString(name);
        if(description != undefined) obj["rdfs:description"] = decodeString(description);

        // Specific for ports
        if(properties.type == IFCPORT || properties.type == IFCDISTRIBUTIONPORT){
            obj["ex:flowDirection"] = properties.FlowDirection.value;
        }

        // // Specific for systems
        // if(properties.type == IFCSYSTEM || properties.type == IFCDISTRIBUTIONSYSTEM){
        //     console.log(properties);
        // }

        // Increment count
        if(progressTracker != undefined) progressTracker.incrementProcessedCount();

        return obj;

    }

}