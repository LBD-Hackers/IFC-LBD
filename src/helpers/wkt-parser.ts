export function parseWKT(wktString: string){

    wktString = wktString.toLocaleLowerCase();

    if(wktString.startsWith("point")){
        return parsePoint(wktString);
    }

}

function parsePoint(wktString: string): number[]{
    const point = wktString.split("(")[1].split(")")[0].trim();  // Ex ["0 0 0"]
    return point.split(" ").map(p => parseFloat(p));
}