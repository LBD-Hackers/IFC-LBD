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
The IFC-LBD parser can be used in a JavaScript project or can be used as a CLI tool.

### CLI Tool
Install globally on your machine
`npm i -g ifc-lbd`

Run a subset (BOT, products)
`ifc-lbd [subset] -i ./myFile-ifc`

See settings
`ifc-lbd -h`

### Building Topology Ontology (BOT)
Exports triples in compliance with the [Building Topology Ontology](https://w3id.org/bot).
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

### Flow Systems Ontology (FSO)
Exports triples in compliance with the [Flow Systems Ontology](https://w3id.org/fso). In addition, ports are also exported and the center points of these are exported as [OMG](https://w3id.org/omg) geometries.
```typescript
// Init LBD Parser and parse FSO
const lbdParser = new LBDParser();
const fsoTriples = await lbdParser.parseFSOTriples(ifcApi, modelID);
```

### IFC Products
```typescript
// Init LBD Parser and parse BOT
const lbdParser = new LBDParser();
const products = await lbdParser.parseProductTriples(ifcApi, modelID);
```

## Contribute
This library is intended to be expanded, so please go and add your parser or extend one of the existing ones!

## Stats
|Model|Duplex|MEP|Schependomlaan|
|---|---|---|---|
|BOT[ms]|34|13|128|
|BOT[triples]|1,718|175|12,251|
|FSO[ms]|-|48|-|
|FSO[triples]|-|1,560|-|
|Products[ms]|9|8|46|
|Products[triples]|218|85|3,635|