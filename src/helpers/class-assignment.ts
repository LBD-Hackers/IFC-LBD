import { IfcAPI } from "web-ifc";
import { getAllItemsOfType, getAllItemsOfTypeOrSubtype } from "./item-search";
import { defaultURIBuilder } from "./uri-builder";

export async function buildClassInstances(ifcAPI: IfcAPI, modelID: number, ifcType: number, rdfClasses: string[], includeSubTypes: boolean = false): Promise<any[]>{

    let items = includeSubTypes 
        ? await getAllItemsOfTypeOrSubtype(ifcAPI, modelID, ifcType) 
        : await getAllItemsOfType(ifcAPI, modelID, ifcType, false);

    return buildClassInstancesFromExpressIDs(ifcAPI, modelID, items, rdfClasses);
    
}

export async function buildClassInstancesFromExpressIDs(ifcAPI: IfcAPI, modelID: number, expressIDs: number[], rdfClasses: string[]){

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