import * as WebIFC from "web-ifc/web-ifc-api.js";
import { TreeNode } from "./BaseDefinitions";
import { getAllItemsOfTypeOrSubtype } from "./item-search";
import { defaultURIBuilder } from "./uri-builder";

export async function buildClassInstances(ifcAPI: WebIFC.IfcAPI, modelID: number, ifcType: number, rdfClasses: string[], includeSubTypes: boolean = false): Promise<any[]>{

    let items = includeSubTypes 
        ? await getAllItemsOfTypeOrSubtype(ifcAPI, modelID, ifcType) 
        : await ifcAPI.properties.getAllItemsOfType(modelID, ifcType, false);

    return buildClassInstancesFromExpressIDs(ifcAPI, modelID, items, rdfClasses);
    
}

export async function buildClassInstancesFromExpressIDs(ifcAPI: WebIFC.IfcAPI, modelID: number, expressIDs: number[], rdfClasses: string[]){

    const graph = [];

    for (let i = 0; i < expressIDs.length; i++) {
        const expressID = expressIDs[i];
        const { GlobalId } = await ifcAPI.properties.getItemProperties(modelID, expressID);
        const URI = defaultURIBuilder(GlobalId.value);

        // Push spaces
        graph.push({
            "@id": URI,
            "@type": rdfClasses
        });
    }

    return graph;

}