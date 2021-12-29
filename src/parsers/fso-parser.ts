import {
    IFCELEMENT,
    IFCOPENINGELEMENT
} from 'web-ifc';

import { buildClassInstances, getElementSubtypes } from "../helpers/class-assignment";
import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { defaultURIBuilder } from "../helpers/uri-builder";
import { IfcElements } from "../helpers/IfcElementsMap";
import { buildRelOneToOne } from '../helpers/path-search';
import { getGlobalPosition, getGlobalRotation } from '../helpers/object-placement';
import * as N3 from 'n3';

const typeMappings: {[key: number]: string[]}  = {
    3205830791: ["fso:DistributionSystem"],
    3740093272: ["fso:Port"],
    987401354: ["fso:Segment", "fso:Component"],
    4278956645: ["fso:Fitting", "fso:Component"],
    2058353004: ["fso:FlowController", "fso:Component"],
    1658829314: ["fso:EnergyConversionDevice", "fso:Component"],
    3132237377: ["fso:FlowMovingDevice", "fso:Component"],
    707683696: ["fso:StorageDevice", "fso:Component"],
    2223149337: ["fso:Terminal", "fso:Component"],
    3508470533: ["fso:TreatmentDevice", "fso:Component"],
}

export class FSOParser extends Parser{

    public async doParse(): Promise<JSONLD|string>{

        this.verbose && console.log("Started FSO parsing");
        this.verbose && console.log("");
        console.time("Finished FSO parsing");

        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/8: Classifying FSO items");
        this.jsonLDObject["@graph"].push(...(await this.classify()));
        this.verbose && console.timeEnd("1/8: Classifying FSO items");
        this.verbose && console.log("");

        this.verbose && console.log("## STEP 2: PORTS ##");
        const portIDs = await this.getPortIDs();
        this.verbose && console.time("2/8: Finding port-port connections");
        this.jsonLDObject["@graph"].push(...(await this.portPort()));
        this.verbose && console.timeEnd("2/8: Finding port-port connections");
        this.verbose && console.time("3/8: Finding port-component connections");
        this.jsonLDObject["@graph"].push(...(await this.portComponent()));
        this.verbose && console.timeEnd("3/8: Finding port-component connections");
        this.verbose && console.time("4/8: Finding port flow directions");
        this.jsonLDObject["@graph"].push(...(await this.portFlowDirection(portIDs)));
        this.verbose && console.timeEnd("4/8: Finding port flow directions");
        this.verbose && console.time("5/8: Finding port placements");
        this.jsonLDObject["@graph"].push(...(await this.portPlacements(portIDs)));
        this.verbose && console.timeEnd("5/8: Finding port placements");
        this.verbose && console.log("");

        // NB! The following steps require an in-memory triplestore to run which is slower than just operating the JSON-LD object
        this.verbose && console.log("## STEP 3: POST PROCESSING ##");
        this.verbose && console.time("6/8: Loading data into in-memory triplestore for querying");
        await this.loadInStore();
        this.verbose && console.timeEnd("6/8: Loading data into in-memory triplestore for querying");
        this.verbose && console.time("7/8: Deducing element conections from ports");
        await this.componentConections();
        this.verbose && console.timeEnd("7/8: Deducing element conections from ports");
        this.verbose && console.time("8/8: Deducing connection interfaces");
        await this.connectionInterfaces();
        this.verbose && console.timeEnd("8/8: Deducing connection interfaces");

        console.timeEnd("Finished FSO parsing");

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
            const fsoClass = typeMappings[typeID];
            graph.push(...(await buildClassInstances(this.ifcAPI, this.modelID, typeID, fsoClass, true)));
        }

        return graph;

    }

    /**
     * RELATIONSHIP ASSIGNMENT
     */

    // <port1> fso:connectedPort <port2>
    // <port2> fso:connectedPort <port1>
    private async portPort(): Promise<any[]>{

        const IFCRELCONNECTSPORTS = 3190031847;
        const subjectRef = "RelatedPort";
        const targetRef = "RelatingPort";
        const rdfRelationship = "fso:connectedPort";
        return await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTS, subjectRef, targetRef, rdfRelationship, false, true);

    }

    // <element> fso:connectedPort <port>
    // <port> fso:connectedElement <element>
    private async portComponent(): Promise<any[]>{

        const IFCRELCONNECTSPORTTOELEMENT = 4201705270;
        let subjectRef = "RelatedElement";
        let targetRef = "RelatingPort";
        let rdfRelationship = "fso:connectedPort";
        const r1 = await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship);

        subjectRef = "RelatingPort";
        targetRef = "RelatedElement";
        rdfRelationship = "fso:connectedComponent";
        const r2 = await buildRelOneToOne(this.ifcAPI, this.modelID, IFCRELCONNECTSPORTTOELEMENT, subjectRef, targetRef, rdfRelationship);

        return r1.concat(r2);
    }

    /**
     * PROPERTIES
     */

    // <port> a fso:InPort .
    // <port> a fso:OutPort .
    // <port> a fso:BidirectionalPort .
    private async portFlowDirection(expressIDArray: number[]): Promise<any[]>{
        
        // Port property example
        // Description: {type: 1, value: 'Flow'}
        // FlowDirection: {type: 3, value: 'SINK'}
        // GlobalId: {type: 1, value: '1noFI6neD67vh$xlz57Jcc'}
        // Name: {type: 1, value: 'InPort_1614379'}
        // ObjectPlacement: IfcLocalPlacement {expressID: 27954, type: 2624227202, PlacementRelTo: IfcLocalPlacement, RelativePlacement: IfcAxis2Placement3D}
        // ObjectType: null
        // OwnerHistory: IfcOwnerHistory {expressID: 42, type: 1207048766, OwningUser: IfcPersonAndOrganization, OwningApplication: IfcApplication, State: null, …}
        // PredefinedType: undefined
        // Representation: null
        // SystemType: undefined
        // expressID: 27956
        // type: 3041715199
        const graph = [];
        for (let i = 0; i < expressIDArray.length; i++) {
            const expressID = expressIDArray[i];
            const props = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

            const flowDirection = props.FlowDirection.value;
            let portType = "";
            if(flowDirection == "SINK") portType = "fso:InPort";
            if(flowDirection == "SOURCE") portType = "fso:OutPort";
            if(flowDirection == "SOURCEANDSINK") portType = "fso:BidirectionalPort";

            if(portType != ""){
                graph.push({
                    "@id": defaultURIBuilder(props.GlobalId.value),
                    "@type": portType
                });
            }

        }

        return graph;

    }

    private async portPlacements(expressIDArray: number[]): Promise<any[]>{
        
        const graph: any[] = [];
        for (let i = 0; i < expressIDArray.length; i++) {
            const expressID = expressIDArray[i];
            const props = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID, true);

            const coordinates = await getGlobalPosition(props.ObjectPlacement);
            const point = `POINT Z(${coordinates[0]} ${coordinates[1]} ${coordinates[2]})`;

            const portURI = defaultURIBuilder(props.GlobalId.value);
            const cpURI = portURI + "_cp";

            graph.push({
                "@id": portURI,
                "omg:hasGeometry": {
                    "@id": cpURI,
                    "@type": ["omg:Geometry", "ex:CenterPoint"],
                    "fog::asSfa_v2-wkt": point
                }
            });

        }

        return graph;

    }

    /**
     * POST PROCESSING
     */
    private async componentConections(): Promise<void>{
        const query = `PREFIX fso: <https://w3id.org/fso#>
                    INSERT{
                        ?e1 fso:connectedWith ?e2 .
                        ?e2 fso:connectedWith ?e1 .
                        ?e1 fso:feedsFluidTo ?e2 .
                        ?e2 fso:hasFluidFedBy ?e1
                    }
                    WHERE{
                        ?e1 fso:connectedPort ?p1 .
                        ?p1 fso:connectedPort ?p2 .
                        ?p2 fso:connectedComponent ?e2 .
                        ?p1 a fso:OutPort .
                        ?p2 a fso:InPort .
                    }`;
        await this.executeUpdateQuery(query);
    }

    private async connectionInterfaces(): Promise<void>{
        const query = `PREFIX fso: <https://w3id.org/fso#>
            PREFIX func: <http://example.org/functions#>
            INSERT{
                ?uri a fso:ConnectionPoint ;
                    fso:connectsFrom ?e1 ;
                    fso:connectsTo ?e2
            }
            WHERE{
                ?e1 fso:connectedPort ?p1 .
                ?p1 fso:connectedPort ?p2 .
                ?p2 fso:connectedComponent ?e2 .
                ?p1 a fso:OutPort .
                ?p2 a fso:InPort .
                BIND(func:uri-concat(?e1, ?e1) AS ?uri)
            }`;
        await this.executeUpdateQuery(query);
    }

    private async getPortIDs(): Promise<number[]>{

        // Get all subTypes of IfcPort
        const IFCPORT = 3740093272;
        const subTypes = getElementSubtypes(IFCPORT);

        // Get all items in model that belong to any of these types
        let expressIDArray: number[] = [];
        for(let typeId of subTypes){
            expressIDArray.push(...await this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false));
        }
        return expressIDArray;
    }

    

}