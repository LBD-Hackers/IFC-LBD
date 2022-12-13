import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
export declare class FSOParser extends Parser {
    doParse(normalizeToSI?: boolean): Promise<JSONLD | string>;
    /**
     * CLASS ASSIGNMENT
     */
    private classify;
    /**
     * RELATIONSHIP ASSIGNMENT
     */
    private portPort;
    private portComponent;
    private systemComponent;
    /**
     * PROPERTIES
     */
    private portFlowDirection;
    private portPlacements;
    private componentConections;
    private segmentLengths;
    /**
     * POST PROCESSING
     */
    private getLengthMultiplicationFactor;
    private calculateDistance;
}
//# sourceMappingURL=fso-parser.d.ts.map