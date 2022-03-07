import { ModelUnits, Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { BehaviorSubject } from 'rxjs';
export declare class PropertyParser extends Parser {
    itemIDs: number[];
    modelUnits: ModelUnits;
    psetNames: string[];
    psetProperties: any;
<<<<<<< HEAD
    processedCount: number;
    processedCount$: BehaviorSubject<number>;
=======
>>>>>>> 1b11010ee10f2e8082c0ba68efbceffe5cbd0347
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
<<<<<<< HEAD
    private resetProcessedCount;
    private incrementProcessedCount;
    private getProgress;
=======
>>>>>>> 1b11010ee10f2e8082c0ba68efbceffe5cbd0347
    private pascalize;
}
//# sourceMappingURL=property-parser.d.ts.map