import * as WebIFC from "web-ifc/web-ifc-api.js";
import { TreeNode } from ".";
import { IfcTypesTree } from "./IfcTypesTree";

export async function getAllItemsOfTypeOrSubtype(ifcAPI: WebIFC.IfcAPI, modelID: number, ifcType: number): Promise<number[]>{
    const subTypes: number[] = getItemSubtypes(ifcType);
    let items: any[] = [];
    for (let i = 0; i < subTypes.length; i++) {
        items.push(...await ifcAPI.properties.getAllItemsOfType(modelID, subTypes[i], false));
    }
    return items;
}

export function getItemSubtypes(type: number): number[]{

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