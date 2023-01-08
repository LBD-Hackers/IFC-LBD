import { JSONLD } from "./BaseDefinitions";

export async function concatJSONLD(docs: JSONLD[]): Promise<JSONLD>{
    return new Promise(resolve => {
        let context = docs[0]["@context"];
        const graph = docs[0]["@graph"];
        docs.forEach((doc, i) => {
            if(i != 0){
                context = {...context, ...doc["@context"]};
                graph.push(...doc["@graph"]);
            }
        });
        resolve({"@context": context, "@graph": graph});
    })
}

export async function concatJSONLDStr(docs: string[]): Promise<string>{
    return new Promise(resolve => {
        let context = getDocContext(docs[0]);
        let graphStr = getDocContentAsString(docs[0]);
        docs.forEach((doc, i) => {
            if(i != 0){
                context = {...context, ...getDocContext(doc)};
                const contentStr = getDocContentAsString(doc);
                if(contentStr){
                    graphStr+= "," + contentStr;
                }
            }
        });
        const mergedDoc: string = `{"@context": ${JSON.stringify(context)}, "@graph": [${graphStr}]}`;
        resolve(mergedDoc);
    })
}

function getDocContext(doc: string): Object{
    return JSON.parse(doc.split(',"@graph"')[0].trim().split('{"@context":')[1]);
}

function getDocContentAsString(doc: string): string{
    const rest = doc.split(',"@graph"')[1];
    let startIndex = rest.indexOf("[");
    let endIndex = rest.lastIndexOf("]");
    return rest.substring(startIndex+1, endIndex).trim();
}