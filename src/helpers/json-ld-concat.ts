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