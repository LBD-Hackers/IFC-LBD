import * as WebIFC from "web-ifc/web-ifc-api.js";
import { TreeNode } from "./BaseDefinitions";
import { IfcTypesTree } from "./IfcTypesTree";
import { defaultURIBuilder } from "./uri-builder";

export async function buildClassInstances(ifcAPI: WebIFC.IfcAPI, modelID: number, ifcType: number, rdfClasses: string[], includeSubTypes: boolean = false): Promise<any[]>{

    let items: any[] = [];

    // Traversing IfcProductTree for subtypes takes around 0.3ms, so not very expensive
    if(includeSubTypes){

        const subTypes: number[] = getElementSubtypes(ifcType);

        for (let i = 0; i < subTypes.length; i++) {
            items.push(...await ifcAPI.properties.getAllItemsOfType(modelID, subTypes[i], false));
        }

    }else{
        items = await ifcAPI.properties.getAllItemsOfType(modelID, ifcType, false);
    }

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

export function getElementSubtypes(type: number): number[]{

    let subTypes: number[] = [];

    // Get the tree node that corresponds to the requested type
    const treeNode = searchProductTree(IfcTypesTree, type);

    if(treeNode){
        // Get all typeIds for the node itself and its subtypes
        collectAllIds(treeNode, subTypes);
    }

    return subTypes;

    // Search IfcProductTree for the particular typeID and get the node
    function searchProductTree(node: TreeNode, typeID: number): TreeNode|null{
        if(node.id == typeID){
             return node;
        }else if (node.children != null){
             var i;
             var result: TreeNode|null = null;
             for(i=0; result == null && i < node.children.length; i++){
                  result = searchProductTree(node.children[i], typeID);
             }
             return result;
        }
        return null;
    }

    // Collect all ids of tree node and its children
    function collectAllIds(node: TreeNode, ids: number[] = []){
        ids.push(node.id);
        if(node.children){
            for (let i = 0; i < node.children.length; i++) {
                collectAllIds(node.children[i], ids);
            }
        }
    }

}