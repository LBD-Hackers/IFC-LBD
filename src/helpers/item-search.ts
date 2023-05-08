import { IfcAPI } from 'web-ifc';
import { TreeNode } from "./BaseDefinitions";
import { IfcTypesTree } from "./IfcTypesTree";

export async function getAllItemsOfTypeOrSubtype(ifcAPI: IfcAPI, modelID: number, ifcType: number): Promise<number[]>{
    const subTypes: number[] = getItemSubtypes(ifcType);
    let items: any[] = [];
    for (let i = 0; i < subTypes.length; i++) {
        items.push(...await getAllItemsOfType(ifcAPI, modelID, subTypes[i], false));
    }
    return items;
}

export async function getAllItemsOfType(ifcAPI: IfcAPI, modelID: number, ifcType: number, verbose = false): Promise<number[]>{
    let items: number[] = [];
    const lines = await ifcAPI.GetLineIDsWithType(modelID, ifcType);
    for (let i = 0; i < lines.size(); i++) items.push(lines.get(i));
    if (!verbose) return items;
    const result: any[] = [];
    for (let i = 0; i < items.length; i++) {
        result.push(await this.api.GetLine(modelID, items[i]));
    }
    return result;
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