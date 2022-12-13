import { WebIfcAPI } from "../../BaseDefinitions";
export declare class PropertySerializer {
    private webIfc;
    dispose(): void;
    constructor(webIfc: WebIfcAPI);
    /**
     * Serializes all the properties of an IFC (exluding the geometry) into an array of Blobs.
     * This is useful for populating databases with IFC data.
     * @modelID ID of the IFC model whose properties to extract.
     * @maxSize (optional) maximum number of entities for each Blob. If not defined, it's infinite (only one Blob will be created).
     * @event (optional) callback called every time a 10% of entities are serialized into Blobs.
     */
    serializeAllProperties(modelID: number, maxSize?: number, event?: (progress: number, total: number) => void): Promise<Blob[]>;
    private getPropertiesAsBlobs;
    private getItemProperty;
    private formatItemProperties;
    private initializePropertiesObject;
    private getBuildingHeight;
    private getBuilding;
    private getAllGeometriesIDs;
}
