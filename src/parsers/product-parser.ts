import {
    IFCELEMENT,
    IFCOPENINGELEMENT,
    IFCRELDEFINESBYTYPE,
    IFCTYPEOBJECT,
    IFCTYPEPRODUCT
} from 'web-ifc';

import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { defaultURIBuilder } from "../helpers/uri-builder";
import { IfcElements } from "../helpers/IfcElementsMap";
import { getItemSubtypes } from '../helpers/item-search';
import { buildRelOneToMany, buildRelOneToOne, Input } from '../helpers/path-search';

export class ProductParser extends Parser{

    public async doParse(): Promise<string>{

        this.verbose && console.log("Started PRODUCTS parsing");
        this.verbose && console.log("");
        console.time("Finished products parsing");

        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/3: Finding products");
        this.jsonLDObject["@graph"].push(...(await this.buildProducts()));
        this.verbose && console.timeEnd("1/3: Finding products");
        this.verbose && console.time("2/3: Finding product types");
        this.jsonLDObject["@graph"].push(...(await this.buildProductTypes()));
        this.verbose && console.timeEnd("2/3: Finding product types");
        this.verbose && console.log("");

        this.verbose && console.log("## STEP 2: PRODUCT -> PRODUCT TYPE ##");
        this.verbose && console.time("3/3: Assigning product types");
        this.jsonLDObject["@graph"].push(...(await this.assignProductType()));
        this.verbose && console.timeEnd("3/3: Assigning product types");
        this.verbose && console.log("");

        console.timeEnd("Finished products parsing");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        return await this.getTriples();

    }

    private async buildProducts(): Promise<any[]>{

        const graph = [];

        const skippedTypes = [IFCOPENINGELEMENT];

        // Get all subTypes of IfcElement
        const subTypes: number[] = getItemSubtypes(IFCELEMENT)
            .filter(typeID => skippedTypes.indexOf(typeID) == -1);  // Filter out skipped types
    

        // Get all items in model that belong to any of these types
        let expressIDArray: number[] = [];
        for(let typeId of subTypes){
            expressIDArray.push(...await this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false));
        }

        // Build triples
        for (let i = 0; i < expressIDArray.length; i++) {
            const expressID = expressIDArray[i];
            
            const {type, GlobalId} = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);
            const URI = defaultURIBuilder(GlobalId.value);

            // Push product
            graph.push({
                "@id": URI,
                "@type": `ifc:${IfcElements[type]}`
            });
            
        }

        return graph;

    }

    private async buildProductTypes(): Promise<any[]>{

        const graph = [];

        // Get all subTypes of IfcTypeObject
        const subTypes: number[] = getItemSubtypes(IFCTYPEOBJECT);
        
        // Get all items in model that belong to any of these types
        let expressIDArray: number[] = [];
        for(let typeId of subTypes){
            expressIDArray.push(...await this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false));
        }

        // Build triples
        for (let i = 0; i < expressIDArray.length; i++) {
            const expressID = expressIDArray[i];
            
            const {type, GlobalId, PredefinedType} = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);
            const URI = defaultURIBuilder(GlobalId.value);

            let obj = {
                "@id": URI,
                "@type": `ifc:${IfcElements[type]}`
            }

            // Add type if present
            if(PredefinedType){
                obj["kbt:ifcTypeSpecification"] = { "@id": `ifc:${PredefinedType.value}` }
            }

            // Push product
            graph.push(obj);
            
        }

        return graph;

    }

    private async assignProductType(): Promise<any[]>{

        const input: Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELDEFINESBYTYPE,
            ifcSubjectRel: "RelatingType",
            ifcTargetRel: "RelatedObjects",
            oppoiteRelationship: "kbt:elementType"
        }

        return await buildRelOneToMany(input);

    }

}