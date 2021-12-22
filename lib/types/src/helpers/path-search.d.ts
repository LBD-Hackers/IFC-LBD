import * as WebIFC from "web-ifc/web-ifc-api.js";
export declare function buildRelOneToOne(ifcAPI: WebIFC.IfcAPI, modelID: number, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, includeInterface?: boolean, biderectional?: boolean): Promise<any>;
export declare function buildRelOneToMany(ifcAPI: WebIFC.IfcAPI, modelID: number, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, subjectClassConstraint?: number, targetClassConstraint?: number): Promise<any>;
//# sourceMappingURL=path-search.d.ts.map