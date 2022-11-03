import { base64chars, error, leadingZeros } from "./utilities";
import { validate as uuidValidate } from 'uuid';

export async function ifcGlobalIdToRevitGuid(ifcGuid: string): Promise<string>{
    return new Promise((resolve, reject) => {
        
        // Inspired by
        //      https://github.com/hakonhc/IfcGuid/blob/master/IfcGuid/IfcGuid.cs
        
        if(ifcGuid.length != 22) reject("ifcGuid argument should not be longer than 22 chars.");

        var num = new Uint32Array(6);
        var str: any = ifcGuid.split('');
        var n = 2;
        var pos = 0;
        for (let i = 0; i < 6; i++)
        {
            num[i] = CvFrom64(str, pos, n);
            pos += n;
            n = 4;
        }

        var a: any = (num[0] * 16777216) + num[1];
        var b: any = Math.floor(num[2] / 256);
        var c: any = ((num[2] % 256) * 256) + Math.floor(num[3] / 65536);
        var d: any = new Uint8Array(8);
        d[0] = Math.floor(num[3] / 256) % 256;
        d[1] = num[3] % 256;
        d[2] = Math.floor(num[4] / 65536);
        d[3] = Math.floor(num[4] / 256) % 256;
        d[4] = num[4] % 256;
        d[5] = Math.floor(num[5] / 65536);
        d[6] = Math.floor(num[5] / 256) % 256;
        d[7] = num[5] % 256;

        const radix = 16;
        a = leadingZeros(a.toString(radix), 8);
        b = leadingZeros(b.toString(radix), 4);
        c = leadingZeros(c.toString(radix), 4);
        d  = buf2hex(d.buffer);
        const revitGuid = `${a}-${b}-${c}-${d.slice(0,4)}-${d.slice(4)}`;

        if(!uuidValidate(revitGuid)) reject("The computed revitGuid is not a valid UUID.")

        resolve(revitGuid);
    })
}

const buf2hex = (buffer: any) => {
    // Inspired by
    //      https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex/50767210
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

const CvFrom64 = (str: string, start: number, len: number) => {
    // Inspired by
    //      https://github.com/hakonhc/IfcGuid/blob/master/IfcGuid/IfcGuid.cs

    var res = 0;
    error(len <= 4, "Length must be equal or less than 4.");
    for (let i = 0; i < len; i++) {
        var index = -1;
        for (let j = 0; j < 64; j++) {
            if (base64chars[j] == str[start + i]) {
                index = j;
                break;
            }
        }
        error(index >= 0, "Index is less than 0.");
        res = (res * 64) + (index);
    }
    return res;
}