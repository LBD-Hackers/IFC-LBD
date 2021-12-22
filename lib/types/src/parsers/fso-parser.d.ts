import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
export declare class FSOParser extends Parser {
    doParse(): Promise<JSONLD | string>;
    /**
     * CLASS ASSIGNMENT
     */
    private classify;
    /**
     * RELATIONSHIP ASSIGNMENT
     */
    private portPort;
    private portComponent;
    /**
     * PROPERTIES
     */
    private portFlowDirection;
    private portPlacements;
    private getPortIDs;
}
//# sourceMappingURL=fso-parser.d.ts.map