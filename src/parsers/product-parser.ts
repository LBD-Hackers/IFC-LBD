import {
    IFCELEMENT,
    IFCOPENINGELEMENT
} from 'web-ifc';

import { getElementSubtypes } from "../helpers/class-assignment";
import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { defaultURIBuilder } from "../helpers/uri-builder";
import { IfcElements } from "../helpers/IfcElementsMap";

export class ProductParser extends Parser{

    public async doParse(): Promise<JSONLD>{

        console.time("Finished products parsing");

        this.jsonLDObject["@graph"] = await this.buildProducts();

        console.timeEnd("Finished products parsing");

        return this.getJSONLD();

    }

    private async buildProducts(): Promise<any[]>{

        const graph = [];

        const skippedTypes = [IFCOPENINGELEMENT];

        // Get all subTypes of IfcElement
        const subTypes: number[] = getElementSubtypes(IFCELEMENT)
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