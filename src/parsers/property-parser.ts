import {
    IFCDISTRIBUTIONPORT,
    IFCDISTRIBUTIONSYSTEM,
    IFCELEMENT,
    IFCGROUP,
    IFCOBJECT,
    IFCPORT,
    IFCPRODUCT,
    IFCSYSTEM
} from 'web-ifc';
import { ModelUnits, Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { getAllItemsOfTypeOrSubtype } from "../helpers/item-search";
import { defaultURIBuilder } from '../helpers/uri-builder';
import { decodeString } from '../helpers/character-decode';
import { IfcDatatypes, IfcLabels } from '../helpers/IfcDatatypesMap';
import { getUCUMCode, UnitType } from '../helpers/unit-tools';

// Thoughts
// - We should probably have a list of known IFC property sets and properties that we can match against

interface PSetProperty{
    URI: string;
    camelName: string;
    label: string;
    unit?: string;
}

export class PropertyParser extends Parser{

    public itemIDs: number[];    // Holds expressIDs for all relevant items
    public modelUnits: ModelUnits;

    public psetNames: string[] = [];    // Holds all property set names found in model
    public psetProperties: any = {};    // Holds the properties that exist in each property set. Key = psetName

    public async doParse(normalizeToSI: boolean = true): Promise<JSONLD|string>{

        this.verbose && console.log("Started PROPERTIES parsing");
        this.verbose && console.log("");
        console.time("Finished PROPERTIES parsing");

        this.verbose && console.log("## PRE STEPS ##");
        this.verbose && console.time("Getting element and group IDs");
        this.itemIDs = await this.getAllRelevantItems();
        this.verbose && console.timeEnd("Getting element and group IDs");
        this.verbose && console.time("Getting model units");
        this.modelUnits = await this.getUnits();
        this.verbose && console.timeEnd("Getting model units");

        this.verbose && console.log("## STEP 1: DIRECT PROPERTIES ##");
        this.verbose && console.time("1/3: Finding direct properties");
        this.jsonLDObject["@graph"].push(...(await this.getElementProperties()));
        this.verbose && console.timeEnd("1/3: Finding direct properties");
        console.log("");

        this.verbose && console.log("## STEP 2: PSET PROPERTIES ##");
        this.verbose && console.time("2/3: Finding pset properties");
        this.jsonLDObject["@graph"].push(...(await this.getPSetProperties(normalizeToSI)));
        this.verbose && console.timeEnd("2/3: Finding pset properties");
        console.log("");

        this.verbose && console.log("## STEP 3: WRITE PROPERTY SETS ##");
        this.verbose && console.time("3/3: Writing the property sets themselves (TBox)");
        this.jsonLDObject["@graph"].push(...(await this.writePSets()));
        this.verbose && console.timeEnd("3/3: Writing the property sets themselves (TBox)");
        console.log("");

        console.timeEnd("Finished PROPERTIES parsing");

        if(this.verbose){
            const tripleCount = await this.getTripleCount();
            console.log("Total triples: " + tripleCount);
        }

        return await this.getTriples();

    }

    async getAllRelevantItems(): Promise<number[]>{
        let arr = [];
        arr.push(...await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCPRODUCT));   // Elements, spaces etc.
        arr.push(...await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCGROUP));     // Systems etc.
        return arr;
    }

    /**
     * DIRECT
     */
    async getElementProperties(): Promise<any[]>{

        const propertyPromises = [];
        for (let i = 0; i < this.itemIDs.length; i++) {
            const expressID = this.itemIDs[i];
            propertyPromises.push(this.buildDirectProperties(expressID));
        }

        return await Promise.all(propertyPromises);

    }

    async getPSetProperties(normalizeToSI: boolean): Promise<any[]>{

        let psetPropsPromises = [];
        for (let i = 0; i < this.itemIDs.length; i++) {
            const expressID = this.itemIDs[i];
            const globalId = await this.getGlobalId(expressID);
            psetPropsPromises.push(this.buildPsetProperties(expressID, globalId, normalizeToSI));
        }
        
        const graph = await Promise.all(psetPropsPromises);
        return graph.filter(item => item != null);  // Remove empty elements

    }

    public writePSets(){

        const graph = [];

        for (let i = 0; i < this.psetNames.length; i++) {

            const psetName = this.psetNames[i];
            const psetURI = `ex:${encodeURIComponent(this.pascalize(psetName))}`;

            let psetObject = {
                "@id": psetURI,
                "@type": "ifc:IfcPropertySet",
                "rdfs:label": psetName,
                "ex:hasProperty": []
            };

            for (let j = 0; j < this.psetProperties[psetName].length; j++) {
                const psetProp = this.psetProperties[psetName][j];

                if(psetProp == undefined) continue;

                const propObject = {
                    "@id": psetProp.URI,
                    "@type": "rdf:Property",
                    "rdfs:label": psetProp.label,
                    "ex:belongsToPset": {"@id": psetURI}
                }

                // Add unit
                if(psetProp.unit != undefined){
                    propObject["qudt:ucumCode"] = {'@value': psetProp.unit, '@type': "xsd:string"};
                }

                psetObject["ex:hasProperty"].push(propObject);
            }

            graph.push(psetObject);
        }

        return graph;
        
    }

    private async buildDirectProperties(expressID: number): Promise<any>{

        const properties = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

        // Example
        // IfcCooledBeam {
        //     expressID: 2701,
        //     type: 4136498852,
        //     GlobalId: { type: 1, value: '0MMKrFmIr4b8IaMYvCQ0YS' },
        //     OwnerHistory: { type: 5, value: 42 },
        //     Name: {
        //       type: 1,
        //       value: 'DID642-4-S2-RR-AV 1200x900-593 158 158 LE - TROX Technik (DEU) #s8hqpa4#:Standard:7295696'
        //     },
        //     Description: null,
        //     ObjectType: {
        //       type: 1,
        //       value: 'DID642-4-S2-RR-AV 1200x900-593 158 158 LE - TROX Technik (DEU) #s8hqpa4#:Standard'
        //     },
        //     ObjectPlacement: { type: 5, value: 2699 },
        //     Representation: { type: 5, value: 2689 },
        //     Tag: { type: 1, value: '7295696' },
        //     PredefinedType: { type: 3, value: 'ACTIVE' }
        //   }
        
        const name = properties.Name?.value;
        const globalId = properties.GlobalId.value;
        this.storeGlobalId(expressID, globalId);    // Store the global id now that we have it (so it is directly available next time)
        const description = properties.Description?.value;

        const URI = defaultURIBuilder(globalId);

        let obj = {"@id": URI, "ex:globalId": globalId};

        if(name != undefined) obj["rdfs:label"] = decodeString(name);
        if(description != undefined) obj["rdfs:description"] = decodeString(description);

        // Specific for ports
        if(properties.type == IFCPORT || properties.type == IFCDISTRIBUTIONPORT){
            obj["ex:flowDirection"] = properties.FlowDirection.value;
        }

        // // Specific for systems
        // if(properties.type == IFCSYSTEM || properties.type == IFCDISTRIBUTIONSYSTEM){
        //     console.log(properties);
        // }

        return obj;

    }

    private async buildPsetProperties(expressID: number, objectGlobalId: string, normalizeToSI: boolean){

        let propObject = {
            "@id": defaultURIBuilder(objectGlobalId)
        }

        const psetProperties = await this.ifcAPI.properties.getPropertySets(this.modelID, expressID, true);

        for (let i = 0; i < psetProperties.length; i++) {

            // Deconstruct object
            const { expressID, type, Name, GlobalId, Description, HasProperties } = psetProperties[i];

            if(HasProperties == undefined || !HasProperties.length) return;
    
            // Add pset name to array containing the pset names
            const psetName = Name.value;
            if(this.psetNames.indexOf(psetName) == -1){
                this.psetNames.push(psetName);
                this.psetProperties[psetName] = [];
            }

            // Loop over properties and save them
            for (let j = 0; j < HasProperties.length; j++) {

                const name = HasProperties[j].Name.value;
                const camelName = this.camelize(name);
                const psetPascalName = this.pascalize(psetName);
                const propNameFull = camelName + psetPascalName;
                const nominalValue = HasProperties[j].NominalValue;
                if(nominalValue == undefined) continue;
                const value = this.nominalValueToJSONLD(nominalValue, normalizeToSI);
                const uri = `inst:${propNameFull}`;

                propObject[uri] = value;

                // Add properties to object containing the pset properties
                if(this.psetProperties[psetName].map(item => item.camelName).indexOf(camelName) == -1){

                    const prop: PSetProperty = {
                        URI: uri,
                        label: name,
                        camelName
                    }

                    if(normalizeToSI){
                        if(nominalValue.label == "IFCLENGTHMEASURE") prop.unit = getUCUMCode(UnitType.LENGTHUNIT, this.modelUnits.LENGTHUNIT);
                        if(nominalValue.label == "IFCAREAMEASURE") prop.unit = getUCUMCode(UnitType.AREAUNIT, this.modelUnits.AREAUNIT);
                        if(nominalValue.label == "IFCVOLUMEMEASURE") prop.unit = getUCUMCode(UnitType.VOLUMEUNIT, this.modelUnits.VOLUMEUNIT);
                    }

                    this.psetProperties[psetName].push(prop);
                }

            }

        }

        // Skip if no properties were added
        if(Object.keys(propObject).length == 1) return null;

        return propObject;

    }

    private nominalValueToJSONLD(val: any, normalizeToSI: boolean){

        let dataType;

        if(IfcLabels[val.label] == "xsd:boolean"){
            if(val.value == "F") val.value = false;
            if(val.value == "T") val.value = true;
            dataType == "xsd:boolean";
        }

        if(IfcLabels[val.label] == "xsd:integer") dataType == "xsd:integer";

        if(normalizeToSI){
            if(val.label == "IFCLENGTHMEASURE"){
                val.value = this.modelUnits.LENGTHUNIT * val.value;
            }
            if(val.label == "IFCAREAMEASURE"){
                val.value = this.modelUnits.AREAUNIT * val.value;
            }
            if(val.label == "IFCVOLUMEMEASURE"){
                val.value = this.modelUnits.VOLUMEUNIT * val.value;
            }
        }

        if(dataType == undefined) dataType = IfcDatatypes[val.valueType];

        if(dataType == undefined) console.log(val);

        let value = dataType == "xsd:string" ? decodeString(val.value) : val.value.toString();

        return {'@value': value, '@type': dataType}
    }

    private camelize(str: string): string{
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '').replace(/\s+/g, '');
    }

    private pascalize(string) {
        return `${string}`
          .replace(new RegExp(/[-_]+/, 'g'), ' ')
          .replace(new RegExp(/[^\w\s]/, 'g'), '')
          .replace(
            new RegExp(/\s+(.)(\w*)/, 'g'),
            ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
          )
          .replace(new RegExp(/\w/), s => s.toUpperCase());
      }

}