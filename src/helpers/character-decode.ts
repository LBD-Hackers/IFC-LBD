const map = {
    "\\\\X2\\\\00FC\\\\X0\\\\": "ü",
    "\\\\X2\\\\00F6\\\\X0\\\\": "ä"
}

export function decodeString(str: string){

    // Skip if no special characters found
    if(str.indexOf("\\") == -1) return str;

    // Replace all known special characters
    const keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
        const regex = new RegExp(keys[i], "g");
        str = str.replace(regex, map[keys[i]]);
    }
    return str;
}