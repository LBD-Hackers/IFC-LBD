import {
    IFCDISTRIBUTIONPORT,
    IFCDISTRIBUTIONSYSTEM,
    IFCELEMENT,
    IFCGROUP,
    IFCOBJECT,
    IFCPORT,
    IFCPRODUCT,
    IFCSYSTEM
} from 'web-ifc';
import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { getAllItemsOfTypeOrSubtype } from "../helpers/item-search";
import { defaultURIBuilder } from '../helpers/uri-builder';
import { decodeString } from '../helpers/character-decode';

export class PropertyParser extends Parser{

    public itemIDs: number[];    // Holds expressIDs for all relevant items

    public async doParse(): Promise<JSONLD|string>{

        this.verbose && console.log("Started PROPERTIES parsing");
        this.verbose && console.log("");
        console.time("Finished PROPERTIES parsing");

        this.verbose && console.log("## PRE STEPS ##");
        this.verbose && console.time("Getting element and group IDs");
        this.itemIDs = await this.getAllRelevantItems();
        this.verbose && console.timeEnd("Getting element and group IDs");

        this.verbose && console.log("## STEP 1: DIRECT PROPERTIES ##");
        this.verbose && console.time("1/1: Finding direct properties");
        this.jsonLDObject["@graph"].push(...(await this.getElementProperties()));
        this.verbose && console.timeEnd("1/1: Finding direct properties");
        console.log("");

        console.timeEnd("Finished PROPERTIES parsing");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        return await this.getTriples();

    }

    async getAllRelevantItems(): Promise<number[]>{
        let arr = [];
        arr.push(...await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCPRODUCT));   // Elements, spaces etc.
        arr.push(...await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCGROUP));     // Systems etc.
        return arr;
    }

    /**
     * DIRECT
     */
    async getElementProperties(){

        const graph = [];

        for (let i = 0; i < this.itemIDs.length; i++) {

            const expressID = this.itemIDs[i];

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
            const description = properties.Description?.value;

            const URI = defaultURIBuilder(globalId);

            let obj = {"@id": URI, "ex:globalId": globalId};

            if(name != undefined) obj["rdfs:label"] = decodeString(name);
            if(description != undefined) obj["rdfs:description"] = description;

            // Specific for ports
            if(properties.type == IFCPORT || properties.type == IFCDISTRIBUTIONPORT){
                obj["ex:flowDirection"] = properties.FlowDirection.value;
            }

            graph.push(obj);

        }
        

        return graph;

     }

}