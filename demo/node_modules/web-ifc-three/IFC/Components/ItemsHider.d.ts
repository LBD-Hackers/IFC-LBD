import { IfcState } from '../BaseDefinitions';
export declare class ItemsHider {
    private state;
    private modelCoordinates;
    private expressIDCoordinatesMap;
    constructor(state: IfcState);
    dispose(): void;
    processCoordinates(modelID: number): void;
    hideItems(modelID: number, ids: number[]): void;
    showItems(modelID: number, ids: number[]): void;
    editCoordinates(modelID: number, ids: number[], hide: boolean): void;
    showAllItems(modelID: number): void;
    hideAllItems(modelID: number): void;
    private initializeCoordinates;
    private resetCoordinates;
    private getCoordinates;
    private getAttributes;
}
