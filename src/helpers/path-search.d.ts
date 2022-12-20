import { IfcAPI } from "web-ifc";
export declare class Input {
    ifcAPI: IfcAPI;
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
