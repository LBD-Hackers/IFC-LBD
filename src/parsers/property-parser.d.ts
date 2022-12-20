import { ModelUnits, Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
import { ProgressTracker } from '../helpers/progress-tracker';
export declare class PropertyParser extends Parser {
    itemIDs: number[];
    modelUnits: ModelUnits;
    psetNames: string[];
    psetProperties: any;
    progressTracker: ProgressTracker;
    doParse(normalizeToSI?: boolean): Promise<JSONLD | string>;
    getAllRelevantItems(): Promise<number[]>;
    /**
     * DIRECT
     */
    getElementProperties(): Promise<any[]>;
    private buildDirectProperties;
}
