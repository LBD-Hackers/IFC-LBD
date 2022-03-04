import { buildClassInstances } from "../helpers/class-assignment";
import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { defaultURIBuilder } from "../helpers/uri-builder";
import { buildRelOneToMany, buildRelOneToOne, Input } from '../helpers/path-search';
import { getGlobalPosition } from '../helpers/object-placement';
import { IFCDISTRIBUTIONSYSTEM, IFCPORT, IFCRELASSIGNSTOGROUP, IFCRELCONNECTSPORTS, IFCRELCONNECTSPORTTOELEMENT, IFCRELNESTS, IFCSYSTEM } from "web-ifc";
import { getAllItemsOfTypeOrSubtype } from "../helpers/item-search";

const typeMappings: {[key: number]: string[]}  = {
    2254336722: ["fso:DistributionSystem"],
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

    public async doParse(normalizeToSI: boolean = true): Promise<JSONLD|string>{

        this.verbose && console.log("Started FSO parsing");
        this.verbose && console.log("");
        console.time("Finished FSO parsing");

        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/10: Classifying FSO items");
        this.jsonLDObject["@graph"].push(...(await this.classify()));
        this.verbose && console.timeEnd("1/10: Classifying FSO items");
        this.verbose && console.log("");

        this.verbose && console.log("## STEP 2: PORTS ##");
        const portIDs = await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCPORT);
        this.verbose && console.time("2/10: Finding port-port connections");
        this.jsonLDObject["@graph"].push(...(await this.portPort()));
        this.verbose && console.timeEnd("2/10: Finding port-port connections");
        this.verbose && console.time("3/10: Finding port-component connections");
        this.jsonLDObject["@graph"].push(...(await this.portComponent()));
        this.verbose && console.timeEnd("3/10: Finding port-component connections");
        this.verbose && console.time("4/10: Finding port flow directions");
        this.jsonLDObject["@graph"].push(...(await this.portFlowDirection(portIDs)));
        this.verbose && console.timeEnd("4/10: Finding port flow directions");
        this.verbose && console.time("5/10: Finding port placements");
        this.jsonLDObject["@graph"].push(...(await this.portPlacements(portIDs, normalizeToSI)));
        this.verbose && console.timeEnd("5/10: Finding port placements");
        this.verbose && console.log("");

        this.verbose && console.log("## STEP 3: SYSTEMS ##");
        this.verbose && console.time("6/10: Finding system-component relationships");
        this.jsonLDObject["@graph"].push(...(await this.systemComponent()));
        this.verbose && console.timeEnd("6/10: Finding system-component relationships");
        this.verbose && console.log("");


        this.verbose && console.log("## STEP 4: POST PROCESSING ##");
        this.verbose && console.time("7/10: Loading data into in-memory triplestore for querying");
        await this.loadInStore();
        this.verbose && console.timeEnd("7/10: Loading data into in-memory triplestore for querying");
        this.verbose && console.time("8/10: Deducing element conections from ports");
        await this.componentConections();
        this.verbose && console.timeEnd("8/10: Deducing element conections from ports");
        this.verbose && console.time("9/10: Deducing connection interfaces");
        await this.connectionInterfaces();
        this.verbose && console.timeEnd("9/10: Deducing connection interfaces");
        this.verbose && console.time("10/10: Calculating segment lengths");
        await this.segmentLengths(normalizeToSI);
        this.verbose && console.timeEnd("10/10: Calculating segment lengths");

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

        const input: Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELCONNECTSPORTS,
            ifcSubjectRel: "RelatedPort",
            ifcTargetRel: "RelatingPort",
            rdfRelationship: "fso:connectedPort",
            includeInterface: false,
            oppoiteRelationship: "fso:connectedPort"
        }

        return await buildRelOneToOne(input);

    }

    // <element> fso:connectedPort <port>
    // <port> fso:connectedElement <element>
    private async portComponent(): Promise<any[]>{

        let graph = [];

        // UNTIL IFC 4, THE RELATIONSHIP IS EXPRESSED WITH IFCRELCONNECTSPORTTOELEMENT
        const inputA: Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELCONNECTSPORTTOELEMENT,
            ifcSubjectRel: "RelatedElement",
            ifcTargetRel: "RelatingPort",
            rdfRelationship: "fso:connectedPort",
            includeInterface: false,
            oppoiteRelationship: "fso:connectedComponent"
        }

        graph.push(...(await buildRelOneToOne(inputA)));

        // AFTER IFC 4, THE RELATIONSHIP IS EXPRESSED WITH IFCRELNESTS
        // IFCRELNESTS has a 
        const inputB: Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELNESTS,
            ifcSubjectRel: "RelatingObject",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "fso:connectedPort",
            includeInterface: false,
            oppoiteRelationship: "fso:connectedComponent"
        }

        graph.push(...(await buildRelOneToMany(inputB)));

        return graph;
    }

    // <system> fso:hasComponent <element>
    private async systemComponent(): Promise<any[]>{

        const input: Input = {
            ifcAPI: this.ifcAPI,
            modelID: this.modelID,
            ifcRelationship: IFCRELASSIGNSTOGROUP,
            ifcSubjectRel: "RelatingGroup",
            ifcTargetRel: "RelatedObjects",
            rdfRelationship: "fso:hasComponent",
            ifcSubjectClassIn: [IFCSYSTEM, IFCDISTRIBUTIONSYSTEM]
        }

        return await buildRelOneToMany(input);

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

    private async portPlacements(expressIDArray: number[], normalizeToSI: boolean): Promise<any[]>{

        let mf = 1
        if(normalizeToSI) mf = await this.getLengthMultiplicationFactor();
        
        const graph: any[] = [];
        for (let i = 0; i < expressIDArray.length; i++) {
            const expressID = expressIDArray[i];
            const props = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID, true);

            const coordinates = await getGlobalPosition(props.ObjectPlacement);
            const point = `POINT Z(${coordinates[0] * mf} ${coordinates[1] * mf} ${coordinates[2] * mf})`;

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
        // Components can be asserted as "fso:connectedWith" each other if their ports are connected.
        const symmetricConnectionQuery = `PREFIX fso: <https://w3id.org/fso#>
                    INSERT {
                        ?e1 fso:connectedWith ?e2 .
                        ?e2 fso:connectedWith ?e1 .
                    }
                    WHERE {
                        ?e1 fso:connectedPort ?p1 .
                        ?p1 fso:connectedPort ?p2 .
                        ?p2 fso:connectedComponent ?e2 .
                        ?p1 a fso:Port .
                        ?p2 a fso:Port .
                    }`;

        // Components can be asserted to have a directional (fluid) flow relationship if ports are 
        // connected and one is an OutPort while the other is an InPort.
        const directionalFluidConnectionQuery = `PREFIX fso: <https://w3id.org/fso#>
                    INSERT {
                        ?e1 fso:feedsFluidTo ?e2 .
                        ?e2 fso:hasFluidFedBy ?e1 .
                    }
                    WHERE {
                        ?e1 fso:connectedPort ?p1 .
                        ?p1 fso:connectedPort ?p2 .
                        ?p2 fso:connectedComponent ?e2 .
                    }`;

        await this.executeUpdateQuery(symmetricConnectionQuery);
        await this.executeUpdateQuery(directionalFluidConnectionQuery);
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

    // NB! pretty slow, so probably better to just get them from the IFC directly
    private async segmentLengths(normalizeToSI: boolean): Promise<void>{

        let multiplicationFactor = 1
        if(normalizeToSI) multiplicationFactor = await this.getLengthMultiplicationFactor();

        const query = `PREFIX fso: <https://w3id.org/fso#>
        PREFIX omg: <https://w3id.org/omg#>
        PREFIX fog: <https://w3id.org/fog#>
        PREFIX ex:  <https://example.com/>
        PREFIX geosf: <http://www.opengis.net/def/function/geosparql/>
        INSERT{
            ?seg ex:length ?d
        }
        WHERE{
            ?seg a fso:Segment ;
                fso:connectedPort ?port1 , ?port2 .
            FILTER(?port1 != ?port2)
            ?port1 omg:hasGeometry/fog::asSfa_v2-wkt ?p1 .
            ?port2 omg:hasGeometry/fog::asSfa_v2-wkt ?p2 .
            BIND(geosf:distance(?p1, ?p2, 3) * ${multiplicationFactor} AS ?d)
        }`;
        await this.executeUpdateQuery(query);
    }

    private async getLengthMultiplicationFactor(): Promise<number>{
        const units = await this.getUnits();
        let multiplicationFactor = 1;
        if(units && units["LENGTHUNIT"] != undefined){
            multiplicationFactor = units["LENGTHUNIT"];
        }
        return multiplicationFactor;
    }

}