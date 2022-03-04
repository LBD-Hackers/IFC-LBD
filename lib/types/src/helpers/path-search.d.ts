import * as WebIFC from "web-ifc/web-ifc-api.js";
export declare class Input {
    ifcAPI: WebIFC.IfcAPI;
    modelID: number;
    ifcRelationship: number;
    ifcSubjectRel: string;
    ifcTargetRel: string;
    rdfRelationship?: string;
    oppoiteRelationship?: string;
    ifcSubjectClassIn?: number[];
    ifcTargetClassIn?: number[];
    includeInterface?: boolean;
}
export declare function buildRelOneToOne(d: Input): Promise<any>;
export declare function buildRelOneToMany(d: Input): Promise<any>;
//# sourceMappingURL=path-search.d.ts.map