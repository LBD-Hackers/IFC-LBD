const map: any = {
    "\\\\X\\\\FC": "ü",
    "\\\\X\\\\F6": "ä",
    "\\\\X\\\\E6": "æ",
    "\\\\X\\\\F8": "ø",
    "\\\\X\\\\E5": "å",
    "\\\\X\\\\C6": "Æ",
    "\\\\X\\\\D8": "Ø",
    "\\\\X\\\\C5": "Å",
    "\\\\X2\\\\00FC\\\\X0\\\\": "ü",
    "\\\\X2\\\\00F6\\\\X0\\\\": "ä",
    "\\\\X2\\\\00E6\\\\X0\\\\": "æ",
    "\\\\X2\\\\00F8\\\\X0\\\\": "ø",
    "\\\\X2\\\\00E5\\\\X0\\\\": "å",
    "\\\\X2\\\\00C6\\\\X0\\\\": "Æ",
    "\\\\X2\\\\00D8\\\\X0\\\\": "Ø",
    "\\\\X2\\\\00C5\\\\X0\\\\": "Å"
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