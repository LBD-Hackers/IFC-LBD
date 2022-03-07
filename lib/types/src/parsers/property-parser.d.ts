import { ModelUnits, Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { BehaviorSubject } from 'rxjs';
export declare class PropertyParser extends Parser {
    itemIDs: number[];
    modelUnits: ModelUnits;
    psetNames: string[];
    psetProperties: any;
    processedCount: number;
    processedCount$: BehaviorSubject<number>;
    doParse(normalizeToSI?: boolean): Promise<JSONLD | string>;
    getAllRelevantItems(): Promise<number[]>;
    /**
     * DIRECT
     */
    getElementProperties(): Promise<any[]>;
    getPSetProperties(normalizeToSI: boolean): Promise<any[]>;
    writePSets(): any[];
    private buildDirectProperties;
    private buildPsetProperties;
    private nominalValueToJSONLD;
    private camelize;
    private resetProcessedCount;
    private incrementProcessedCount;
    private getProgress;
    private pascalize;
}
//# sourceMappingURL=property-parser.d.ts.map