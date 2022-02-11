import {
    IFCELEMENT,
    IFCOPENINGELEMENT
} from 'web-ifc';

import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { defaultURIBuilder } from "../helpers/uri-builder";
import { IfcElements } from "../helpers/IfcElementsMap";
import { getItemSubtypes } from '../helpers/item-search';

export class ProductParser extends Parser{

    public async doParse(): Promise<JSONLD|string>{

        this.verbose && console.log("Started PRODUCTS parsing");
        this.verbose && console.log("");
        console.time("Finished products parsing");

        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/1: Finding products");
        this.jsonLDObject["@graph"] = await this.buildProducts();
        this.verbose && console.timeEnd("1/1: Finding products");
        this.verbose && console.log("");

        console.timeEnd("Finished products parsing");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        return await this.getTriples();

    }

    private async buildProducts(): Promise<any[]>{

        const graph = [];

        const skippedTypes = [IFCOPENINGELEMENT];

        // Get all subTypes of IfcElement
        const subTypes: number[] = getItemSubtypes(IFCELEMENT)
            .filter(typeID => skippedTypes.indexOf(typeID) == -1);  // Filter out skipped types
    

        // Get all items in model that belong to any of these types
        let expressIDArray: number[] = [];
        for(let typeId of subTypes){
            expressIDArray.push(...await this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false));
        }

        for (let i = 0; i < expressIDArray.length; i++) {
            const expressID = expressIDArray[i];
            
            const {type, GlobalId} = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);
            const URI = defaultURIBuilder(GlobalId.value);

            // Push product
            graph.push({
                "@id": URI,
                "@type": `ifc:${IfcElements[type]}`
            });
            
        }

        return graph;

    }

}