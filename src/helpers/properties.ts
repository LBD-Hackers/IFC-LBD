import { IfcAPI } from 'web-ifc/web-ifc-api.js';
import { defaultURIBuilder } from "./uri-builder";

import {
    IfcElementQuantity,
    IFCELEMENTQUANTITY,
    IfcElements,
    IfcPropertySet,
    IFCPROPERTYSET,
    IFCQUANTITYAREA,
    IFCQUANTITYCOUNT,
    IFCQUANTITYLENGTH,
    IFCQUANTITYVOLUME,
    IFCRELDEFINESBYPROPERTIES
} from 'web-ifc/web-ifc-api.js';
import { getUCUMCode, UnitType } from "./unit-tools";
import { IfcDatatypes, IfcLabels } from "./IfcDatatypesMap";
import { ModelUnits } from "../parsers/parser";
import { decodeString } from "./character-decode";
import { ProgressTracker } from "./progress-tracker";

interface PSetProperty{
    URI: string;
    camelName: string;
    label: string;
    unit?: string;
}

export class Input{
    ifcAPI: IfcAPI;
    modelID: number;
    modelUnits: ModelUnits;
    normalizeToSI: boolean = true;
}

export class PropertyAPI{

    private ifcAPI: IfcAPI;
    private modelID: number;
    private normalizeToSI: boolean;
    private modelUnits: ModelUnits;

    public psetNames: string[] = [];    // Holds all property set names found in model
    public psetProperties: any = {};    // Holds the properties that exist in each property set. Key = psetName

    public quantityProperties: any = {};    // Holds the quantity properties. Key = quantityPropName

    constructor(d: Input){
        this.ifcAPI = d.ifcAPI;
        this.modelID = d.modelID;
        this.normalizeToSI = d.normalizeToSI;
        this.modelUnits = d.modelUnits;
    }

    public async getAllProperties(verbose: boolean = false): Promise<any>{

        // Subscribe to progress in current event
        const progressTracker = new ProgressTracker();

        let graph = [];

        const rels = await this.ifcAPI.properties.getAllItemsOfType(this.modelID, IFCRELDEFINESBYPROPERTIES, false);

        if(verbose){
            progressTracker.getProgress(rels.length).subscribe(progress => {
                console.log(progress);
            });
        }
    
        for (let i = 0; i < rels.length; i++) {
    
            const relID = rels[i];
    
            const relProps = await this.ifcAPI.properties.getItemProperties(this.modelID, relID);
    
            const objects = relProps.RelatedObjects;
            const propertyObject = await this.processPropertyDefinition(relProps.RelatingPropertyDefinition.value);

            if(!propertyObject || propertyObject == undefined || Object.keys(propertyObject).length == 0) continue;

            // Assign to all objects
            for (let j = 0; j < objects.length; j++) {

                const {GlobalId} = await this.ifcAPI.properties.getItemProperties(this.modelID, objects[j].value);
                const objectURI = defaultURIBuilder(GlobalId.value);
                const itemObject = Object.assign({"@id": objectURI}, propertyObject);
                graph.push(itemObject);

            }

            progressTracker.incrementProcessedCount();
    
        }

        return graph;
    
    }

    // Returns JSON-LD that defines the property sets and their contained properties
    public getPSets(){

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

    public getElementQuantities(){

        const graph = [];

        const names = Object.keys(this.quantityProperties);

        for (let i = 0; i < names.length; i++) {

            const quantityName = names[i];
            const quantityURI = `ex:${encodeURIComponent(this.pascalize(quantityName))}`;

            let psetObject = {
                "@id": quantityURI,
                "@type": "ifc:IfcElementQuantity",
                "rdfs:label": quantityName,
                "ex:hasQuantity": []
            };

            for (let j = 0; j < this.quantityProperties[quantityName].quantities.length; j++) {
                const qSetProp = this.quantityProperties[quantityName].quantities[j];

                if(qSetProp == undefined) continue;

                const propObject = {
                    "@id": qSetProp.uri,
                    "@type": "rdf:Property",
                    "rdfs:label": qSetProp.label,
                    "ex:belongsToElementQuantity": {"@id": quantityURI}
                }

                // Add unit
                if(qSetProp.unit != undefined){
                    propObject["qudt:ucumCode"] = {'@value': qSetProp.unit, '@type': "xsd:string"};
                }

                psetObject["ex:hasQuantity"].push(propObject);
            }

            graph.push(psetObject);
        }

        return graph;
        
    }

    private async processPropertyDefinition(propDefExpressID: number){

        const propDef = await this.ifcAPI.properties.getItemProperties(this.modelID, propDefExpressID, true);
    
        if(propDef.type == IFCPROPERTYSET){
            return await this.processPSetProperty(propDef);
        }
    
        if(propDef.type == IFCELEMENTQUANTITY){
            return await this.processQuantityProperty(propDef);
        }

        else{
            console.log("Unhandled property type");
            console.log(IfcElements[propDef.type]);
        }
    
    }

    private async processQuantityProperty(qProp: IfcElementQuantity){

        let propObject = {};

        // Deconstruct object
        const { Name, MethodOfMeasurement, Quantities } = qProp;

        const name = Name.value;

        if(Object.keys(this.quantityProperties).indexOf(name) == -1){
            this.quantityProperties[name] = {
                name,
                methodOfMeasurement: MethodOfMeasurement,
                quantities: []
            }
        }

        // Loop over quantities and save them
        for (let i = 0; i < Quantities.length; i++) {

            const quantity: any = Quantities[i];

            const uri = defaultURIBuilder(this.camelize(quantity.Name.value));

            if(!this.quantityProperties[name].quantities.length || this.quantityProperties[name].quantities.map(item => item.uri).indexOf(uri) == -1){
                this.quantityProperties[name].quantities.push({uri, label: quantity.Name.value});
            }

            if(quantity.type == IFCQUANTITYLENGTH){
                if(quantity.AreaValue == undefined) continue;
                const val = quantity.LengthValue;
                const value = this.normalizeToSI ? this.modelUnits.LENGTHUNIT * val.value : val.value;
                propObject[uri] = {"@value": value.toString(), "@type": IfcDatatypes[val.type]};
            }
            
            else if(quantity.type == IFCQUANTITYAREA){
                if(quantity.AreaValue == undefined) continue;
                const val = quantity.AreaValue;
                const value = this.normalizeToSI ? this.modelUnits.AREAUNIT * val.value : val.value;
                propObject[uri] = {"@value": value.toString(), "@type": IfcDatatypes[val.type]};
            }

            else if(quantity.type == IFCQUANTITYVOLUME){
                if(quantity.VolumeValue == undefined) continue;
                const val = quantity.VolumeValue;
                const value = this.normalizeToSI ? this.modelUnits.VOLUMEUNIT * val.value : val.value;
                propObject[uri] = {"@value": value.toString(), "@type": IfcDatatypes[val.type]};
            }

            else if(quantity.type == IFCQUANTITYCOUNT){
                if(quantity.CountValue == undefined) continue;
                propObject[uri] = {"@value": quantity.CountValue.toString(), "@type": "xsd:integer"};
            }

            else{
                console.log("Unhandled quantity type");
                console.log(quantity);
            }

        }

        return propObject;

    }

    private async processPSetProperty(pset: IfcPropertySet){

        let propObject = {};

        // Deconstruct object
        const { Name, HasProperties } = pset;

        if(HasProperties == undefined || !HasProperties.length) return;

        // Add pset name to array containing the pset names
        const psetName = Name.value;
        if(this.psetNames.indexOf(psetName) == -1){
            this.psetNames.push(psetName);
            this.psetProperties[psetName] = [];
        }

        // Loop over properties and save them
        for (let i = 0; i < HasProperties.length; i++) {

            const prop: any = HasProperties[i];

            const name = prop.Name.value;
            const camelName = this.camelize(name);
            const psetPascalName = this.pascalize(psetName);
            const propNameFull = camelName + psetPascalName;
            const nominalValue = prop.NominalValue;
            if(nominalValue == undefined) continue;
            const value = this.nominalValueToJSONLD(nominalValue, this.normalizeToSI);
            const uri = `inst:${propNameFull}`;

            propObject[uri] = value;

            // Add properties to object containing the pset properties
            if(this.psetProperties[psetName].map(item => item.camelName).indexOf(camelName) == -1){

                const prop: PSetProperty = {
                    URI: uri,
                    label: name,
                    camelName
                }

                if(this.normalizeToSI){
                    if(nominalValue.label == "IFCLENGTHMEASURE") prop.unit = getUCUMCode(UnitType.LENGTHUNIT, this.modelUnits.LENGTHUNIT);
                    if(nominalValue.label == "IFCAREAMEASURE") prop.unit = getUCUMCode(UnitType.AREAUNIT, this.modelUnits.AREAUNIT);
                    if(nominalValue.label == "IFCVOLUMEMEASURE") prop.unit = getUCUMCode(UnitType.VOLUMEUNIT, this.modelUnits.VOLUMEUNIT);
                }

                this.psetProperties[psetName].push(prop);
            }

        }

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