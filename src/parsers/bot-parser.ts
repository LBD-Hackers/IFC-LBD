import { buildRelOneToMany, buildRelOneToOne } from "../helpers/path-search";

import {
    IFCRELSPACEBOUNDARY,
    IFCRELCONTAINEDINSPATIALSTRUCTURE,
    IFCRELVOIDSELEMENT,
    IFCRELAGGREGATES,
    IFCBUILDING,
    IFCSITE,
    IFCBUILDINGSTOREY,
    IFCSPACE,
    IFCELEMENT
} from 'web-ifc';
import { buildClassInstances } from "../helpers/class-assignment";
import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";

export class BOTParser extends Parser{

    public async doParse(): Promise<JSONLD>{

        console.time("Finished BOT parsing");

        // Class assignment
        this.jsonLDObject["@graph"].push(...(await this.buildSites()));
        this.jsonLDObject["@graph"].push(...(await this.buildBuildings()));
        this.jsonLDObject["@graph"].push(...(await this.buildStoreys()));
        this.jsonLDObject["@graph"].push(...(await this.buildSpaces()));
        this.jsonLDObject["@graph"].push(...(await this.buildElements()));

        // Space-Element relationships
        this.jsonLDObject["@graph"].push(...(await this.buildSpaceAdjacentElementRelationships()));
        this.jsonLDObject["@graph"].push(...(await this.buildSpaceContainedElementRelationships()));
        this.jsonLDObject["@graph"].push(...(await this.buildStoreyElementRelationships()));

        // Element-element relationships
        this.jsonLDObject["@graph"].push(...(await this.buildHostedElementRelationships()));

        // Zone containment
        this.jsonLDObject["@graph"].push(...(await this.buildStoreySpaceRelationships()));
        this.jsonLDObject["@graph"].push(...(await this.buildBuildingStoreyRelationships()));

        console.timeEnd("Finished BOT parsing");

        return this.getJSONLD();

    }

    /**
     * CLASS ASSIGNMENT
     */
     private async buildSites(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCSITE, "bot:Site");
    }
    private async buildBuildings(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCBUILDING, "bot:Building");
    }
    private async buildStoreys(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCBUILDINGSTOREY, "bot:Storey");
    }
    private async buildSpaces(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCSPACE, "bot:Space");
    }
    private async buildElements(): Promise<any[]>{
        const includeSubTypes: boolean = true;
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCELEMENT, "bot:Element", includeSubTypes);
    }

    /**
     * ZONE-ELEMENT-RELATIONSHIPS
     */
    private async buildSpaceAdjacentElementRelationships(): Promise<any[]>{
        const subjectRef = "RelatingSpace";
        const targetRef = "RelatedBuildingElement";
        const rdfRelationship = "bot:adjacentElement";
        return await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELSPACEBOUNDARY, subjectRef, targetRef, rdfRelationship, true);
    }

    private async buildSpaceContainedElementRelationships(): Promise<any[]>{
        const subjectRef = "RelatingStructure";
        const targetRef = "RelatedElements";
        const rdfRelationship = "bot:containsElement";
        const subjectClass = IFCSPACE;
        return await buildRelOneToMany(this.ifcAPI, this.modelID, IFCRELCONTAINEDINSPATIALSTRUCTURE, subjectRef, targetRef, rdfRelationship, subjectClass);
    }

    private async buildStoreyElementRelationships(): Promise<any[]>{
        const subjectRef = "RelatingStructure";
        const targetRef = "RelatedElements";
        const rdfRelationship = "bot:hasElement";
        const subjectClass = IFCBUILDINGSTOREY;
        return await buildRelOneToMany(this.ifcAPI, this.modelID, IFCRELCONTAINEDINSPATIALSTRUCTURE, subjectRef, targetRef, rdfRelationship, subjectClass);
    }

    /**
     * ELEMENT-ELEMENT-RELATIONSHIPS
     */
     private async buildHostedElementRelationships(): Promise<any[]>{
        const subjectRef = "RelatingBuildingElement";
        const targetRef = "RelatedOpeningElement";
        const rdfRelationship = "bot:hasSubElement";
        return await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELVOIDSELEMENT, subjectRef, targetRef, rdfRelationship);
    }

    /**
     * ZONE-CONTAINMENT
     */
    private async buildStoreySpaceRelationships(): Promise<any[]>{
        const subjectRef = "RelatingObject";
        const targetRef = "RelatedObjects";
        const rdfRelationship = "bot:hasSpace";
        const subjectClass = IFCBUILDINGSTOREY;
        const targetClass = IFCSPACE;
        return await buildRelOneToMany(this.ifcAPI, this.modelID, IFCRELAGGREGATES, subjectRef, targetRef, rdfRelationship, subjectClass, targetClass);
    }

    private async buildBuildingStoreyRelationships(): Promise<any[]>{
        const subjectRef = "RelatingObject";
        const targetRef = "RelatedObjects";
        const rdfRelationship = "bot:hasStorey";
        const subjectClass = IFCBUILDING;
        const targetClass = IFCBUILDINGSTOREY;
        return await buildRelOneToMany(this.ifcAPI, this.modelID, IFCRELAGGREGATES, subjectRef, targetRef, rdfRelationship, subjectClass, targetClass);
    }

}