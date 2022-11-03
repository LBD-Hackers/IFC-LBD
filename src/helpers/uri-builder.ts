import { guidTools } from '.';
import { contextBasedGuid } from './guid-tools';

// Uses a URI encoded version of the GlobalId
export function defaultURIBuilder(globalId: string) {
    return `inst:${encodeURIComponent(globalId)}`;
}

// Unique based on context string
export function contextBasedUUID(contextString: string) {
    return `inst:${contextBasedGuid(contextString)}`;
}

// Uses the Revit UUID version of the IFC GlobalId
export async function uuidURIBuilder(globalId: string) {
    return `inst:${await guidTools.ifcGlobalIdToRevitGuid(globalId)}`;
}