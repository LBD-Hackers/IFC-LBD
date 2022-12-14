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

    public async doParse(normalizeToSI: boolean = false): Promise<JSONLD|string>{

        this.verbose && console.log("Started FSO parsing");
        this.verbose && console.log("");
        console.time("Finished FSO parsing");

        this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
        this.verbose && console.time("1/9: Classified FSO items");
        const segments = await this.classify();
        this.verbose && console.timeEnd("1/9: Classified FSO items");
        this.verbose && console.log("");

        this.verbose && console.log("## STEP 2: PORTS ##");
        this.verbose && console.time("2/9: Got ports");
        const portIDs = await getAllItemsOfTypeOrSubtype(this.ifcAPI, this.modelID, IFCPORT);
        if(!portIDs.length) console.warn("The MEP system doesn't have ports, and therfore, only very little context can be extracted!");
        this.verbose && console.timeEnd("2/9: Got ports");

        if(portIDs.length){

            // Connections
            this.verbose && console.time("3/9: Found port-port connections");
            const portPortConnections = await this.portPort();
            this.verbose && console.timeEnd("3/9: Found port-port connections");
            this.verbose && console.time("4/9: Found port-component connections");
            const portElementConnections = await this.portComponent();
            this.verbose && console.timeEnd("4/9: Found port-component connections");

            // Flow directions
            this.verbose && console.time("5/9: Found port flow directions");
            const portTypes = await this.portFlowDirection(portIDs);
            this.verbose && console.timeEnd("5/9: Found port flow directions");

            // Port placements
            this.verbose && console.time("6/9: Found port placements");
            const portPlacements = await this.portPlacements(portIDs, normalizeToSI);
            this.verbose && console.timeEnd("6/9: Found port placements");
            this.verbose && console.log("");

            // Deduce element conections from ports
            this.verbose && console.time("7/9: Found element flow connections");
            await this.componentConections(portTypes, portPortConnections, portElementConnections);
            this.verbose && console.timeEnd("7/9: Found element flow connections");
            this.verbose && console.log("");

            // Calculate segment lengths
            this.verbose && console.time("8/9: Calculated segment lengths");
            await this.segmentLengths(segments, portPlacements, portElementConnections);
            this.verbose && console.timeEnd("8/9: Calculated segment lengths");
            this.verbose && console.log("");

        }

        this.verbose && console.log("## STEP 3: SYSTEMS ##");
        this.verbose && console.time("6/8: Found system-component relationships");
        this.jsonLDObject["@graph"].push(...(await this.systemComponent()));
        this.verbose && console.timeEnd("6/8: Found system-component relationships");
        this.verbose && console.log("");


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

        let segments: any = [];

        const typeIDs = Object.keys(typeMappings);
        for (let i = 0; i < typeIDs.length; i++) {
            const typeID: any = typeIDs[i];
            const fsoClass = typeMappings[typeID];
            const res = await buildClassInstances(this.ifcAPI, this.modelID, typeID, fsoClass, true);
            this.jsonLDObject["@graph"].push(...res);
            if(typeID == 987401354){
                segments = res;
            }
        }

        return segments;

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

        const portPortConnections = await buildRelOneToOne(input);

        this.jsonLDObject["@graph"].push(...portPortConnections);

        return portPortConnections;

    }

    // <element> fso:connectedPort <port>
    // <port> fso:connectedElement <element>
    private async portComponent(): Promise<any[]>{

        let portElementConnections = [];

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

        portElementConnections.push(...await buildRelOneToOne(inputA));

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

        this.jsonLDObject["@graph"].push(...portElementConnections);

        return portElementConnections;

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

        let ports: any[] = [];
        let foundDirected: boolean = false;

        for (let i = 0; i < expressIDArray.length; i++) {

            const expressID = expressIDArray[i];
            const props = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);

            const flowDirection = props.FlowDirection.value;

            const map: any = {
                "SINK": "fso:InPort",
                "SOURCE": "fso:OutPort",
                "SOURCEANDSINK": "fso:BidirectionalPort",
                "NOTDEFINED": "fso:BidirectionalPort"
            }
            if(Object.keys(map).includes(flowDirection)){
                if(!foundDirected && map[flowDirection] != "fso:BidirectionalPort") foundDirected = true;
                ports.push({ "@id": defaultURIBuilder(props.GlobalId.value), "@type": map[flowDirection] });
            }

        }

        if(!foundDirected) console.warn("None of the ports in the model are directed, and therefore, it was not possible to determine flow directions!");

        this.jsonLDObject["@graph"].push(...ports);

        return ports;

    }

    private async portPlacements(expressIDArray: number[], normalizeToSI: boolean): Promise<any[]>{

        let portPlacements: any = {};

        let mf = 1;
        if(normalizeToSI){
            mf = await this.getLengthMultiplicationFactor();
        }
        
        for (let i = 0; i < expressIDArray.length; i++) {

            const expressID = expressIDArray[i];
            const props = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID, true);

            const coordinates = await getGlobalPosition(props.ObjectPlacement);
            const point = `POINT Z(${coordinates[0] * mf} ${coordinates[1] * mf} ${coordinates[2] * mf})`;

            const portURI = defaultURIBuilder(props.GlobalId.value);
            const cpURI = portURI + "_cp";

            portPlacements[portURI] = coordinates.map(c => c*mf);

            this.jsonLDObject["@graph"].push({
                "@id": portURI,
                "omg:hasGeometry": {
                    "@id": cpURI,
                    "@type": ["omg:Geometry", "ex:CenterPoint"],
                    "fog:asSfa_v2-wkt": point
                }
            });

        }

        return portPlacements;

    }

    private async componentConections(portTypes: any[], portPortConnections: any[], portElementConnections: any[], includeInterfaces: boolean = true): Promise<void>{
        
        const connections: any[] = [];

        // Components can be asserted as "fso:connectedWith" each other if their ports are connected
        for (let i = 0; i < portPortConnections.length; i++) {
            const connection = portPortConnections[i];
            const fromPort = connection["@id"];
            const toPort = connection["fso:connectedPort"]["@id"];
            if(fromPort != undefined && toPort != undefined){
                const fromElement = portElementConnections.find((item: any) => item["@id"] == fromPort);
                const toElement = portElementConnections.find((item: any) => item["@id"] == toPort);

                if(fromElement != undefined && toElement != undefined){

                    const from = fromElement["fso:connectedComponent"]["@id"];
                    const to = toElement["fso:connectedComponent"]["@id"];

                    connections.push({
                        "@id": from,
                        "fso:connectedWith": {"@id": to}
                    });

                    // Direction known?
                    const fromPortType = portTypes.find((item: any) => item["@id"] == fromPort);
                    if(fromPortType != undefined){
                        const type = fromPortType["@type"];
                        if(type == "fso:InPort"){
                            connections.push({
                                "@id": from,
                                "fso:hasFluidSuppliedBy": {"@id": to}
                            },{
                                "@id": to,
                                "fso:suppliesFluidTo": {"@id": from}
                            });
                        }else if(type == "fso:OutPort"){
                            connections.push({
                                "@id": to,
                                "fso:hasFluidSuppliedBy": {"@id": from}
                            },{
                                "@id": from,
                                "fso:suppliesFluidTo": {"@id": to}
                            });
                        }
                    }
    
                }

            }
            
        }

        this.jsonLDObject["@graph"].push(...connections);

    }

    private async segmentLengths(segments: any, portPlacements: any, portElementConnections: any): Promise<void>{

        let lengthTriples: any[] = [];
        let errors: string[] = [];

        let lengthPromises: any[] = [];
        let segmentURIs: string[] = [];
        for (let i = 0; i < segments.length; i++) {

            const segmentURI = segments[i]["@id"];
            const portURIs = portElementConnections.filter((conn: any) => conn["@id"] == segmentURI).map((conn: any) => conn["fso:connectedPort"]["@id"]);

            if(portURIs.length != 2){
                errors.push(`Segment ${segmentURI} has ${portURIs.length} port(s) - expected 2`)
                continue;
            }
            
            const p1 = portPlacements[portURIs[0]];
            const p2 = portPlacements[portURIs[1]];

            lengthPromises.push(this.calculateDistance(p1, p2));
            segmentURIs.push(segmentURI);

        }

        const lengths = await Promise.all(lengthPromises);
        for (let i = 0; i < lengths.length; i++) {
            const segmentURI = segmentURIs[i];
            const length = lengths[i];
            lengthTriples.push({
                "@id": segmentURI,
                "ex:length": length
            })
        }

        if(errors.length){
            console.warn(`${errors.length}/${segments.length} segments did not have exactly 2 ports`);
            // console.log(errors);
        }

        this.jsonLDObject["@graph"].push(...lengthTriples);

    }

    /**
     * POST PROCESSING
     */
    // private async componentConections(): Promise<void>{
    //     // Components can be asserted as "fso:connectedWith" each other if their ports are connected.
    //     const symmetricConnectionQuery = `PREFIX fso: <https://w3id.org/fso#>
    //                 INSERT {
    //                     ?e1 fso:connectedWith ?e2 .
    //                     ?e2 fso:connectedWith ?e1 .
    //                 }
    //                 WHERE {
    //                     ?e1 fso:connectedPort ?p1 .
    //                     ?p1 fso:connectedPort ?p2 .
    //                     ?p2 fso:connectedComponent ?e2 .
    //                     ?p1 a fso:Port .
    //                     ?p2 a fso:Port .
    //                 }`;

    //     // Components can be asserted to have a directional (fluid) flow relationship if ports are 
    //     // connected and one is an OutPort while the other is an InPort.
    //     const directionalFluidConnectionQuery = `PREFIX fso: <https://w3id.org/fso#>
    //                 INSERT {
    //                     ?e1 fso:feedsFluidTo ?e2 .
    //                     ?e2 fso:hasFluidFedBy ?e1 .
    //                 }
    //                 WHERE {
    //                     ?e1 fso:connectedPort ?p1 .
    //                     ?p1 fso:connectedPort ?p2 .
    //                     ?p2 fso:connectedComponent ?e2 .
    //                 }`;

    //     await this.executeUpdateQuery(symmetricConnectionQuery);
    //     await this.executeUpdateQuery(directionalFluidConnectionQuery);

    // }

    // private async connectionInterfaces(): Promise<void>{
    //     const query = `PREFIX fso: <https://w3id.org/fso#>
    //         PREFIX func: <http://example.org/functions#>
    //         INSERT{
    //             ?uri a fso:ConnectionPoint ;
    //                 fso:connectsFrom ?e1 ;
    //                 fso:connectsTo ?e2
    //         }
    //         WHERE{
    //             ?e1 fso:connectedPort ?p1 .
    //             ?p1 fso:connectedPort ?p2 .
    //             ?p2 fso:connectedComponent ?e2 .
    //             ?p1 a fso:OutPort .
    //             ?p2 a fso:InPort .
    //             BIND(func:uri-concat(?e1, ?e1) AS ?uri)
    //         }`;
    //     await this.executeUpdateQuery(query);
    // }

    // NB! pretty slow, so probably better to just get them from the IFC directly
    // private async segmentLengths(normalizeToSI: boolean): Promise<void>{

    //     let mf = 1;
    //     let decimals = 3;
    //     if(normalizeToSI){
    //         mf = await this.getLengthMultiplicationFactor();
    //     }

    //     const query = `PREFIX fso: <https://w3id.org/fso#>
    //     PREFIX omg: <https://w3id.org/omg#>
    //     PREFIX fog: <https://w3id.org/fog#>
    //     PREFIX ex:  <https://example.com/>
    //     PREFIX geosf: <http://www.opengis.net/def/function/geosparql/>
    //     INSERT{
    //         ?seg ex:length ?d
    //     }
    //     WHERE{
    //         ?seg a fso:Segment ;
    //             fso:connectedPort ?port1 , ?port2 .
    //         FILTER(?port1 != ?port2)
    //         ?port1 omg:hasGeometry/fog:asSfa_v2-wkt ?p1 .
    //         ?port2 omg:hasGeometry/fog:asSfa_v2-wkt ?p2 .
    //         BIND(geosf:distance(?p1, ?p2, ${decimals}, ${mf}) AS ?d)
    //     }`;
    //     await this.executeUpdateQuery(query);
    // }

    private async getLengthMultiplicationFactor(): Promise<number>{
        const units = await this.getUnits();
        let multiplicationFactor = 1;
        if(units && units["LENGTHUNIT"] != undefined){
            multiplicationFactor = units["LENGTHUNIT"];
        }
        return multiplicationFactor;
    }

    private async calculateDistance(p1: number[], p2: number[], decimals: number = 3): Promise<number>{
        return new Promise((resolve, reject) => {
            const a = p1[0] - p2[0];
            const b = p1[1] - p2[1];
            const c = p1[2] - p2[2];
            const d = Math.sqrt(a * a + b * b + c * c);
            const rounded = Math.round( d * (10 ** decimals) + Number.EPSILON ) / (10 ** decimals);
            resolve(rounded);
        })
    }

}