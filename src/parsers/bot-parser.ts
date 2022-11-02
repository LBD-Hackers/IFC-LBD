import { pathSearch } from "../helpers";

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

    public async doParse(): Promise<JSONLD|string>{

        this.verbose && console.log("Started BOT parsing");
        this.verbose && console.log("");
        console.time("Finished BOT parsing");

        // Class assignment
        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/12: Finding sites");
        this.jsonLDObject["@graph"].push(...(await this.buildSites()));
        this.verbose && console.timeEnd("1/12: Finding sites");
        this.verbose && console.time("2/12: Finding buildings");
        this.jsonLDObject["@graph"].push(...(await this.buildBuildings()));
        this.verbose && console.timeEnd("2/12: Finding buildings");
        this.verbose && console.time("3/12: Finding storeys");
        this.jsonLDObject["@graph"].push(...(await this.buildStoreys()));
        this.verbose && console.timeEnd("3/12: Finding storeys");
        this.verbose && console.time("4/12: Finding spaces");
        this.jsonLDObject["@graph"].push(...(await this.buildSpaces()));
        this.verbose && console.timeEnd("4/12: Finding spaces");
        this.verbose && console.time("5/12: Finding elements");
        this.jsonLDObject["@graph"].push(...(await this.buildElements()));
        this.verbose && console.timeEnd("5/12: Finding elements");
        this.verbose && console.log("");

        // Space-Element relationships
        this.verbose && console.log("## STEP 2: SPACE-ELEMENT RELATIONSHIPS ##");
        this.verbose && console.time("6/12: Finding spaces' adjacent elements");
        this.jsonLDObject["@graph"].push(...(await this.buildSpaceAdjacentElementRelationships()));
        this.verbose && console.timeEnd("6/12: Finding spaces' adjacent elements");
        this.verbose && console.time("7/12: Finding spaces' contained elements");
        this.jsonLDObject["@graph"].push(...(await this.buildSpaceContainedElementRelationships()));
        this.verbose && console.timeEnd("7/12: Finding spaces' contained elements");
        this.verbose && console.time("8/12: Finding storeys' elements");
        this.jsonLDObject["@graph"].push(...(await this.buildStoreyElementRelationships()));
        this.verbose && console.timeEnd("8/12: Finding storeys' elements");
        this.verbose && console.log("");

        // Element-element relationships
        this.verbose && console.log("## STEP 3: ELEMENT-ELEMENT RELATIONSHIPS ##");
        this.verbose && console.time("9/12: Finding elements' hosted elements");
        this.jsonLDObject["@graph"].push(...(await this.buildHostedElementRelationships()));
        this.verbose && console.timeEnd("9/12: Finding elements' hosted elements");
        this.verbose && console.log("");

        // Zone containment
        this.verbose && console.log("## STEP 4: ZONE-ZONE RELATIONSHIPS ##");
        this.verbose && console.time("10/12: Finding storeys' spaces");
        this.jsonLDObject["@graph"].push(...(await this.buildStoreySpaceRelationships()));
        this.verbose && console.timeEnd("10/12: Finding storeys' spaces");
        this.verbose && console.time("11/12: Finding buildings' storeys");
        this.jsonLDObject["@graph"].push(...(await this.buildBuildingStoreyRelationships()));
        this.verbose && console.timeEnd("11/12: Finding buildings' storeys");
        this.verbose && console.time("12/12: Finding sties' buildings");
        this.jsonLDObject["@graph"].push(...(await this.buildSiteBuildingRelationships()));
        this.verbose && console.timeEnd("12/12: Finding sties' buildings");
        this.verbose && console.log("");

        console.timeEnd("Finished BOT parsing");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        return await this.getTriples();

    }

    /**
     * CLASS ASSIGNMENT
     */
     private async buildSites(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCSITE, ["bot:Site"]);
    }
    private async buildBuildings(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCBUILDING, ["bot:Building"]);
    }
    private async buildStoreys(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCBUILDINGSTOREY, ["bot:Storey"]);
    }
    private async buildSpaces(): Promise<any[]>{
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCSPACE, ["bot:Space"]);
    }
    private async buildElements(): Promise<any[]>{
        const includeSubTypes: boolean = true;
        return await buildClassInstances(this.ifcAPI, this.modelID, IFCELEMENT, ["bot:Element"], includeSubTypes);
    }

    /**
     * ZONE-ELEMENT-RELATIONSHIPS
     */
    private async buildSpaceAdjacentElementRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELSPACEBOUNDARY,
            ifcSubjectRel: "RelatingSpace",
            ifcTargetRel: "RelatedBuildingElement",
            rdfRelationship: "bot:adjacentElement",
            includeInterface: true
        }

        return await pathSearch.buildRelOneToOne(input);

    }

    private async buildSpaceContainedElementRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELCONTAINEDINSPATIALSTRUCTURE,
            ifcSubjectRel: "RelatingStructure",
            ifcTargetRel: "RelatedElements",
            rdfRelationship: "bot:containsElement",
            ifcSubjectClassIn: [IFCSPACE]
        }

        return await pathSearch.buildRelOneToMany(input);

    }

    private async buildStoreyElementRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELCONTAINEDINSPATIALSTRUCTURE,
            ifcSubjectRel: "RelatingStructure",
            ifcTargetRel: "RelatedElements",
            rdfRelationship: "bot:hasElement",
            ifcSubjectClassIn: [IFCBUILDINGSTOREY]
        }

        return await pathSearch.buildRelOneToMany(input);

    }

    /**
     * ELEMENT-ELEMENT-RELATIONSHIPS
     */

    // NB! PROBABLY REFERS TO THE VOID AND NOT THE WINDOW!
     private async buildHostedElementRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELVOIDSELEMENT,
            ifcSubjectRel: "RelatingBuildingElement",
            ifcTargetRel: "RelatedOpeningElement",
            rdfRelationship: "bot:hasSubElement"
        }

        return await pathSearch.buildRelOneToOne(input);

    }

    /**
     * ZONE-CONTAINMENT
     */
    private async buildStoreySpaceRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "bot:hasSpace",
            ifcSubjectClassIn: [IFCBUILDINGSTOREY],
            ifcTargetClassIn: [IFCSPACE]
        }

        return await pathSearch.buildRelOneToMany(input);

    }

    private async buildBuildingStoreyRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "bot:hasStorey",
            ifcSubjectClassIn: [IFCBUILDING],
            ifcTargetClassIn: [IFCBUILDINGSTOREY]
        }

        return await pathSearch.buildRelOneToMany(input);

    }

    private async buildSiteBuildingRelationships(): Promise<any[]>{

        const input: pathSearch.Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELAGGREGATES,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "bot:hasBuilding",
            ifcSubjectClassIn: [IFCSITE],
            ifcTargetClassIn: [IFCBUILDING]
        }

        return await pathSearch.buildRelOneToMany(input);

    }

}