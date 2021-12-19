import * as WebIFC from "web-ifc/web-ifc-api.js";
import { defaultURIBuilder } from "./uri-builder";

export async function buildRelOneToOne(ifcAPI: WebIFC.IfcAPI, modelID: number = 0, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, includeInterface: boolean = false, biderectional: boolean = false): Promise<any>{

    const graph = [];

    const rels = await ifcAPI.properties.getAllItemsOfType(modelID, relationshipType, false);

    for (let i = 0; i < rels.length; i++) {

        const relID = rels[i];

        const relProps = await ifcAPI.properties.getItemProperties(modelID, relID);

        // Only continue if the interface is between an element and a space
        if(!relProps[subjectRef] || !relProps[targetRef]) { continue; }

        // Get properties of related and relating
        const [subject, target] = await Promise.all([
            ifcAPI.properties.getItemProperties(modelID, relProps[subjectRef].value),
            ifcAPI.properties.getItemProperties(modelID, relProps[targetRef].value)
        ]);

        const subjectURI = defaultURIBuilder(subject.GlobalId.value);
        const targetURI = defaultURIBuilder(target.GlobalId.value);
        const interfaceURI = defaultURIBuilder(relProps.GlobalId.value);

        // Push relationships
        graph.push({
            "@id": subjectURI,
            [rdfRelationship]: {"@id": targetURI}
        });

        // Optionally, push it in opposite direction
        if(biderectional){
            graph.push({
                "@id": targetURI,
                [rdfRelationship]: {"@id": subjectURI}
            });
        }

        // Optionally, also include the interface
        if(includeInterface){
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

export async function buildRelOneToMany(ifcAPI: WebIFC.IfcAPI, modelID: number = 0, relationshipType: number, subjectRef: string, targetRef: string, rdfRelationship: string, subjectClassConstraint?: number, targetClassConstraint?: number): Promise<any>{

    const graph = [];

    const rels = await ifcAPI.properties.getAllItemsOfType(modelID, relationshipType, false);

    for (let i = 0; i < rels.length; i++) {

        const relID = rels[i];

        const relProps = await ifcAPI.properties.getItemProperties(modelID, relID);

        // Only continue if the interface is between an element and a space
        if(!relProps[subjectRef] || !relProps[targetRef]) { continue; }

        const subject = await ifcAPI.properties.getItemProperties(modelID, relProps[subjectRef].value);

        // It might be that we are only interested in relationship where the subject fulfills the constraint
        if(subjectClassConstraint && subject.type != subjectClassConstraint) { continue; }

        const targetPromises: any = [];
        for (let i = 0; i < relProps[targetRef].length; i++) {
            targetPromises.push(ifcAPI.properties.getItemProperties(modelID, relProps[targetRef][i].value));
        }
        const targets = await Promise.all(targetPromises);

        const targetObjects = targets
            .filter((t: any) => {
                // It might be that we are only interested in relationship where the target fulfills the constraint
                if(targetClassConstraint && t.type != targetClassConstraint) return false;
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
        graph.push({
            "@id": subjectURI,
            [rdfRelationship]: targetObjects
        });

    }

    return graph;

}