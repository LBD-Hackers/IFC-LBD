import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
export declare class PropertyParser extends Parser {
    itemIDs: number[];
    doParse(): Promise<JSONLD | string>;
    getAllRelevantItems(): Promise<number[]>;
    /**
     * DIRECT
     */
    getElementProperties(): Promise<any[]>;
}
//# sourceMappingURL=property-parser.d.ts.map