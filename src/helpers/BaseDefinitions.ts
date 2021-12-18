export interface JSONLD{
    "@context": any,
    "@graph": any[]
}

export interface TreeNode{
    "name": string;
    "id": number;
    "children"?: TreeNode[];
}

export interface Triple{
    subject: TripleItem,
    predicate: TripleItem,
    object: TripleItem,
    graph: TripleItem
}

export interface TripleItem{
    termType: string;
    value: string;
}