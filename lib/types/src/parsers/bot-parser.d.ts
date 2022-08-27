import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
export declare class BOTParser extends Parser {
    doParse(): Promise<JSONLD | string>;
    /**
     * CLASS ASSIGNMENT
     */
    private buildSites;
    private buildBuildings;
    private buildStoreys;
    private buildSpaces;
    private buildElements;
    /**
     * ZONE-ELEMENT-RELATIONSHIPS
     */
    private buildSpaceAdjacentElementRelationships;
    private buildSpaceContainedElementRelationships;
    private buildStoreyElementRelationships;
    /**
     * ELEMENT-ELEMENT-RELATIONSHIPS
     */
    private buildHostedElementRelationships;
    /**
     * ZONE-CONTAINMENT
     */
    private buildStoreySpaceRelationships;
    private buildBuildingStoreyRelationships;
    private buildSiteBuildingRelationships;
}
//# sourceMappingURL=bot-parser.d.ts.map