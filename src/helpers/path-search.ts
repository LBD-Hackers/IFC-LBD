import * as WebIFC from "web-ifc/web-ifc-api.js";
import { defaultURIBuilder } from "./uri-builder";

export class Input{
    ifcAPI: WebIFC.IfcAPI;
    modelID: number;
    ifcRelationship: number;        // Eg. IFCRELCONNECTSPORTS
    ifcSubjectRel: string;          // Eg. RelatedPort
    ifcTargetRel: string;           // Eg. RelatingPort
    rdfRelationship?: string;       // Eg. fso:connectedPort
    oppoiteRelationship?: string;   // Optional - used to establish a relationship in the other direction. For bidirectional relationships, use the same value as for rdfRelationship
    ifcSubjectClassIn?: number[];   // Optional - used to limit bindings to cases where the subject is included in this list
    ifcTargetClassIn?: number[];    // Optional - used to limit bindings to cases where the target is included in this list
    includeInterface?: boolean;     // Used to also include the ifcRelationship as a bot:Interface
}

// ifcAPI: WebIFC.IfcAPI, modelID: number = 0, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, includeInterface: boolean = false, biderectional: boolean = false
export async function buildRelOneToOne(d: Input): Promise<any>{

    if(d.includeInterface == undefined) d.includeInterface = false;
    if(d.ifcSubjectClassIn == undefined) d.ifcSubjectClassIn = [];
    if(d.ifcTargetClassIn == undefined) d.ifcTargetClassIn = [];

    if(d.ifcSubjectClassIn.length) console.log("ifcSubjectClassIn not yet supported for buildRelOneToOne");
    if(d.ifcTargetClassIn.length) console.log("ifcTargetClassIn not yet supported for buildRelOneToOne");

    if(d.rdfRelationship == undefined && d.oppoiteRelationship == undefined){
        console.error("Specify either an 'rdfRelationship' or an 'oppoiteRelationship'");
        return [];
    }

    const graph = [];

    const rels = await d.ifcAPI.properties.getAllItemsOfType(d.modelID, d.ifcRelationship, false);

    for (let i = 0; i < rels.length; i++) {

        const relID = rels[i];

        const relProps = await d.ifcAPI.properties.getItemProperties(d.modelID, relID);

        // Only continue if the interface is between an element and a space
        if(!relProps[d.ifcSubjectRel] || !relProps[d.ifcTargetRel]) { continue; }

        // Get properties of related and relating
        const [subject, target] = await Promise.all([
            d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcSubjectRel].value),
            d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcTargetRel].value)
        ]);

        if(subject.GlobalId.value == "0dG4XB8Mj2QhLcDnrkJh$F"){
            console.log("subject");
        }

        if(target.GlobalId.value == "0dG4XB8Mj2QhLcDnrkJh$F"){
            console.log("target");
        }

        const subjectURI = defaultURIBuilder(subject.GlobalId.value);
        const targetURI = defaultURIBuilder(target.GlobalId.value);
        const interfaceURI = defaultURIBuilder(relProps.GlobalId.value);

        // Push relationships
        if(d.rdfRelationship != undefined){
            graph.push({
                "@id": subjectURI,
                [d.rdfRelationship]: {"@id": targetURI}
            });
        }

        // Push relationships in opposite direction
        if(d.oppoiteRelationship != undefined){
            graph.push({
                "@id": targetURI,
                [d.oppoiteRelationship]: {"@id": subjectURI}
            });
        }

        // Optionally, also include the interface
        if(d.includeInterface){
            graph.push({
                "@id": interfaceURI,
                "@type": "bot:Interface",
                "ex:expressID": relProps.expressID,
                "bot:interfaceOf": [
                    {"@id": subjectURI},
                    {"@id": targetURI}
                ]
            });
        }

    }

    return graph;

}

// ifcAPI: WebIFC.IfcAPI, modelID: number = 0, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, subjectClassConstraint?: number, targetClassConstraint?: number
export async function buildRelOneToMany(d: Input): Promise<any>{

    if(d.includeInterface == undefined) d.includeInterface = false;
    if(d.ifcSubjectClassIn == undefined) d.ifcSubjectClassIn = [];
    if(d.ifcTargetClassIn == undefined) d.ifcTargetClassIn = [];

    if(d.includeInterface) console.log("Include interface not yet supported for buildRelOneToMany");

    if(d.rdfRelationship == undefined && d.oppoiteRelationship == undefined){
        console.error("Specify either an 'rdfRelationship' or an 'oppoiteRelationship'");
        return [];
    }

    const graph = [];

    const rels = await d.ifcAPI.properties.getAllItemsOfType(d.modelID, d.ifcRelationship, false);

    for (let i = 0; i < rels.length; i++) {

        const relID = rels[i];

        const relProps = await d.ifcAPI.properties.getItemProperties(d.modelID, relID);

        // Only continue if the interface is between an element and a space
        if(!relProps[d.ifcSubjectRel] || !relProps[d.ifcTargetRel]) { continue; }

        const subject = await d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcSubjectRel].value);

        if(d.ifcSubjectClassIn.length && d.ifcSubjectClassIn.indexOf(subject.type) == -1) { continue; }

        const targetPromises: any = [];
        for (let i = 0; i < relProps[d.ifcTargetRel].length; i++) {
            targetPromises.push(d.ifcAPI.properties.getItemProperties(d.modelID, relProps[d.ifcTargetRel][i].value));
        }
        const targets = await Promise.all(targetPromises);

        let types = new Set();
        const targetObjects = targets
            .filter((t: any) => {
                // It might be that we are only interested in relationship where the target fulfills the constraint
                types.add(t.type);
                if(d.ifcTargetClassIn.length && d.ifcTargetClassIn.indexOf(t.type) == -1) return false;
                return true;
            })
            .map((t: any) => {
                const targetURI = defaultURIBuilder(t.GlobalId.value);
                return {"@id": targetURI}
            });

        // Skip if no target objects
        if(!targetObjects.length) { continue; }

        const subjectURI = defaultURIBuilder(subject.GlobalId.value);

        // Push relationships
        if(d.rdfRelationship != undefined){
            graph.push({
                "@id": subjectURI,
                [d.rdfRelationship]: targetObjects
            });
        }

        // Push relationships in opposite direction
        if(d.oppoiteRelationship != undefined){
            targetObjects.forEach(item => {
                const obj = JSON.parse(JSON.stringify(item));
                graph.push(Object.assign(obj, {[d.oppoiteRelationship]: {"@id": subjectURI}}));
            })
        }

    }

    return graph;

}