import { base64chars, error } from "./utilities";
import {Buffer} from 'buffer';

export function revitGuidToIFCGlobalId(revitGuid: string): string{
    // Inspired by
    //      https://github.com/hakonhc/IfcGuid/blob/master/IfcGuid/IfcGuid.cs
    //      https://stackoverflow.com/questions/39422506/is-it-possible-to-convert-from-4x-uint8-into-uint32-using-typed-arrays-in-javasc
    //      https://standards.buildingsmart.org/IFC/RELEASE/IFC2x3/TC1/HTML/ifcutilityresource/lexical/text/CreateGuid_64.c
    //      https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/operators/arithmetic-operators#division-operator-
    error(revitGuid.length == 36, "The revitGuid argument does not match a Revit guid.");

    var numbers = new Uint32Array(6);
    var ifcGuid = "                      ".split('');
    var bytes = guidToBytes(revitGuid);
    var buffer: Buffer = Buffer.from(bytes);

    // Create the components of the GUID structure
    let [x,y,z] = [buffer.readUInt32LE(), buffer.readUInt16LE(4), buffer.readUInt16LE(6)];
    let [i,j,k] = [16777216, 256, 65536];
    numbers[0] = Math.floor(x / i);
    numbers[1] = x % i;
    numbers[2] = y * j + Math.floor(z / j);
    numbers[3] = (z % j) * k + bytes[8] * j + bytes[9];
    numbers[4] = bytes[10] * k + bytes[11] * j + bytes[12];
    numbers[5] = bytes[13] * k + bytes[14] * j + bytes[15];

    var n = 2;
    var pos = 0;
    for (let i = 0; i < 6; i++) {
        CvTo64(numbers[i], ifcGuid, pos, n);
        pos += n;
        n = 4;
    }
    return ifcGuid.join('');
}

const guidToBytes = (guid: string) => {
    // Inspired by
    //      https://gist.github.com/daboxu/4f1dd0a254326ac2361f8e78f89e97ae
    var bytes: any[] = [];
    guid.split('-').map((number: any, index) => {
        var bytesInChar: any = index < 3 ? number.match(/.{1,2}/g).reverse() : number.match(/.{1,2}/g);
        bytesInChar.map((byte: any) => { bytes.push(parseInt(byte, 16));})
    });
    return bytes;
}

const CvTo64 = (number: any, result: any, start: any, length: any) => {
    // Inspired by
    //      https://github.com/hakonhc/IfcGuid/blob/master/IfcGuid/IfcGuid.cs

    error(length <= 4, "Length must be equal or less than 4.");
    var act = number;
    const digits = length;
    for (let digit = 0; digit < digits; digit++) {
        result[start + length - digit - 1] = base64chars[act % 64];
        act = Math.floor(act / 64);
    }
    error(act == 0, `Logic failed, act was not 0 but ${act}`);
    return result;
}