import { Parser } from "./parser";
import { JSONLD } from "../helpers";
export declare class TSOParser extends Parser {
    doParse(): Promise<JSONLD | string>;
    /**
     * CLASS ASSIGNMENT
     */
    private classify;
    /**
     * RELATIONSHIPS
     */
    private connections;
}
//# sourceMappingURL=tso-parser.d.ts.map