import { error, leadingZeros } from "./utilities";

export function revitUniqueIdToRevitGuid(revitUniqueId, revitElementId: any = undefined, log=false){
    // Inspired by
    //      https://thebuildingcoder.typepad.com/blog/2009/02/uniqueid-dwf-and-ifc-guid.html
    //      https://docs.microsoft.com/en-us/dotnet/api/system.guid?view=netcore-3.1

    error(revitUniqueId.length == 45, "The revitUniqueId argument does not match a Revit unique id.");
    if (!(revitElementId == undefined)) {
        error(revitElementId.toString().length == 6, "The revitElementId argument does not match a Revit element id.");
    }
    const radix = 16;
    if (log) {
        console.log('Revit UniqueId: ', revitUniqueId);
    }

    // Episode
    const episodeId = revitUniqueId.slice(0,36);
    if (log) {
        console.log('     EpisodeId: ', episodeId.toString());
    }

    // Element
    const elementIdHex = revitUniqueId.slice(37);
    const elementId = Number.parseInt(elementIdHex, radix);
    if (!(revitElementId == undefined)) {
        error(elementId == revitElementId, "The derived elementId mismatches the provided revitElementId argument.");
    }
    if (log) {
        console.log(`     ElementId:  ${elementId.toString()} = ${elementIdHex}`);
    }

    // XOR
    const last32Bits = Number.parseInt(revitUniqueId.slice(28,36), radix);
    // const xor = last32Bits ^ elementId;
    const xor = (last32Bits ^ elementId) >>> 0;
    if (log) {
        console.log('           XOR: ', xor);
    }

    // XOR hex
    var xorHex = leadingZeros(xor.toString(radix), 8);
    if (log) {
        console.log('        XORhex: ', xorHex);
    }

    // Guid
    const revitGuid = revitUniqueId.slice(0, 28) + xorHex;
    error(revitGuid.length == 36, "The revitGuid argument does not match a Revit guid.");
    if (log) {
        console.log('          Guid: ', revitGuid);
    }
    return revitGuid;
}