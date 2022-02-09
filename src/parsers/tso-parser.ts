import { buildClassInstances } from "../helpers/class-assignment";
import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { buildRelOneToOne } from "../helpers/path-search";

const typeMappings: {[key: number]: string[]}  = {
    3740093272: ["tso:ConnectionPoint"],
    1945004755: ["tso:Component"]
}

export class TSOParser extends Parser{

    public async doParse(): Promise<JSONLD|string>{

        this.verbose && console.log("Started TSO parsing");
        this.verbose && console.log("");
        console.time("Finished TSO parsing");

        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/2: Classifying TSO components");
        this.jsonLDObject["@graph"].push(...(await this.classify()));
        this.verbose && console.timeEnd("1/2: Classifying TSO components");
        this.verbose && console.log("");

        this.verbose && console.log("## STEP 2: CONNECTION POINTS ##");
        this.verbose && console.time("2/2: Finding port-port connections");
        this.jsonLDObject["@graph"].push(...(await this.connections()));
        this.verbose && console.timeEnd("2/2: Finding port-port connections");

        console.timeEnd("Finished TSO parsing");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        return await this.getTriples();

    }

    /**
     * CLASS ASSIGNMENT
     */
    private async classify(): Promise<any[]>{

        const graph = [];

        const typeIDs = Object.keys(typeMappings);
        for (let i = 0; i < typeIDs.length; i++) {
            const typeID: any = typeIDs[i];
            const tsoClass = typeMappings[typeID];
            graph.push(...(await buildClassInstances(this.ifcAPI, this.modelID, typeID, tsoClass, true)));
        }

        return graph;

    }

    /**
     * RELATIONSHIPS
     */

    // <component> tso:connectsAt <connectionPoint>
    // <connectionPoint> tso:connectionPointOf <component>
    private async connections(): Promise<any[]>{

        const IFCRELCONNECTSPORTTOELEMENT = 4201705270;
        let subjectRef = "RelatedElement";
        let targetRef = "RelatingPort";
        let rdfRelationship = "tso:connectsAt";
        const r1 = await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship);

        subjectRef = "RelatingPort";
        targetRef = "RelatedElement";
        rdfRelationship = "tso:connectionPointOf";
        const r2 = await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship);

        return r1.concat(r2);
    }

}