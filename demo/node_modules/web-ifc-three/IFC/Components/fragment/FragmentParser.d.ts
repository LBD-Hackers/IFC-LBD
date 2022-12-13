import { IfcState } from '../../BaseDefinitions';
import { MeshLambertMaterial, BufferGeometry } from 'three';
import { BvhManager } from '../BvhManager';
import { Fragment } from 'bim-fragment/fragment';
import { TypeManager } from "../TypeManager";
import { PropertyManagerAPI } from "../properties/BaseDefinitions";
import { IFCModel } from "../IFCModel";
export interface ParserProgress {
    loaded: number;
    total: number;
}
export interface OptionalCategories {
    [category: number]: boolean;
}
export declare class FragmentGroup extends IFCModel {
    fragments: Fragment[];
    levelRelationships: any;
    allTypes: any;
    itemTypes: any;
    floorsProperties: any;
}
export interface GeometriesByMaterial {
    [materialID: string]: {
        material: MeshLambertMaterial;
        geometries: BufferGeometry[];
    };
}
/**
 * Reads all the geometry of the IFC file and generates an optimized `THREE.Mesh`.
 */
export declare class FragmentParser {
    private state;
    private properties?;
    private types?;
    private BVH?;
    instancedCategories: Set<number>;
    splitByFloors: boolean;
    splitByCategory: boolean;
    loadedModels: number;
    optionalCategories: OptionalCategories;
    private items;
    private materials;
    private loadingState;
    private currentWebIfcID;
    private currentModelID;
    constructor(state: IfcState, properties?: PropertyManagerAPI | undefined, types?: TypeManager | undefined, BVH?: BvhManager | undefined);
    setupOptionalCategories(config: OptionalCategories): Promise<void>;
    parse(buffer: any, coordinationMatrix?: number[]): Promise<FragmentGroup>;
    getAndClearErrors(_modelId: number): void;
    private notifyProgress;
    private newIfcModel;
    private loadAllGeometry;
    private initializeLoadingState;
    private notifyLoadingEnded;
    private updateLoadingState;
    private addOptionalCategories;
    private streamMesh;
    private getBufferGeometry;
    private getMeshMatrix;
    private ifcGeometryToBuffer;
}
