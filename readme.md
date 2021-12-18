# IFC to LBD
IFC to Linked Building Data (LBD) is built on [IFC.js](https://ifcjs.github.io/info/). It uses the [web-ifc](https://github.com/IFCjs/web-ifc) model loader and parses out triples in [JSON-LD](https://json-ld.org/) format.

## Install
`npm i ifc-lbd`

## Why
Working with IFC in the express file format, and therefore the IFC.js project is like sent from the sky. It provides tools that make it a whole lot easier to retrieve properties and traverse the relationships of the IFC file, but even so, it is still a cumbersome job to work with IFC.

The minimal [Building Topology Ontology (BOT)](https://w3id.org/bot), however, is quite straightforward to understand, and having a BOT dataset in RDF is cool because it allows you to do sophisticated queries it with [SPARQL](https://www.w3.org/TR/sparql11-query/). The resulting JSON-LD-object can furthermore be re-structured using the cool concepts of *compaction*, *expansion* and *framing*. For example, it might be useful to use framing to build a simple tree structure of the graph as demonstrated below:

```typescript
const frame = {
  "@context": {
    "bot": "https://w3id.org/bot#",
    "ex": "https://example.com/"
  },
  "@type": "bot:Building",
  "bot:hasStorey": {
    "@type": "bot:Storey",
    "bot:hasSpace": {
      "@type": "bot:Space"
    }
  }
}

const framed = await jsonld.frame(botTriples, frame);
```

## Use

### Building Topology Ontology (BOT)
```typescript
// Init API and load model
const ifcApi = new WebIFC.IfcAPI();
await ifcApi.Init();
const modelID = ifcApi.OpenModel(ifcModelData);

// Init LBD Parser and parse BOT
const lbdParser = new LBDParser();
const botTriples = await lbdParser.parseBOTTriples(ifcApi, modelID);

// Close the model, all memory is freed
ifcApi.CloseModel(modelID);
```

### IFC Products
```typescript
// Init API and load model
const ifcApi = new WebIFC.IfcAPI();
await ifcApi.Init();
const modelID = ifcApi.OpenModel(ifcModelData);

// Init LBD Parser and parse BOT
const lbdParser = new LBDParser();
const products = await lbdParser.parseProductTriples(ifcApi, modelID);

// Close the model, all memory is freed
ifcApi.CloseModel(modelID);
```

### CLI tool
`npm i -g ifc-lbd`
`ifc-lbd parse ./myFile-ifc`