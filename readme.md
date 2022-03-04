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
`ifc-lbd [subset] -i ./myFile.ifc`

See settings
`ifc-lbd -h`

Run in dev
`node ./lib/cli-tool/index.js bot -i ./tests/artifacts/Duplex.ifc`

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
Exports triples in compliance with the [Flow Systems Ontology](https://w3id.org/fso). In addition, ports are also exported and the center points of these are exported as [OMG](https://w3id.org/omg) geometries. Pipe lengths are calculated from the distance between its two ports.

Coordinates and lengths are normalized to meters.

```typescript
// Init LBD Parser and parse FSO
const lbdParser = new LBDParser();
const fsoTriples = await lbdParser.parseFSOTriples(ifcApi, modelID);
```

### Flow Systems Ontology (FSO)
Exports triples in compliance with the [TUBES System Ontology](https://w3id.org/tso). This is a Work in Progress and currently only supports few concepts.
```typescript
// Init LBD Parser and parse FSO
const lbdParser = new LBDParser();
const fsoTriples = await lbdParser.parseFSOTriples(ifcApi, modelID);
```

### IFC Products
```typescript
// Init LBD Parser and parse products
const lbdParser = new LBDParser();
const products = await lbdParser.parseProductTriples(ifcApi, modelID);
```

### IFC Properties
All measurements (lengths, areas, volumes) are normalized to SI-units (m, m2, m3).
```typescript
// Init LBD Parser and parse properties
const lbdParser = new LBDParser();
const properties = await lbdParser.parsePropertyTriples(ifcApi, modelID);
```

## Contribute
This library is intended to be expanded, so please go and add your parser or extend one of the existing ones!

Remember to write tests! That's also the preferred approach to developing new functionalities. Run specific test: `npm run test -i <path>` (eg `jest -i tests/fso.spec.ts`)

## Stats
|Model|Duplex (2,4MB)|MEP(962KB)|Schependomlaan(49,3MB)|Office MEP(209,1MB)|
|---|---|---|---|---|
|BOT[ms]|34|13|128|349|
|BOT[triples]|1,718|175|12,251|33,087|
|FSO[ms]|-|48|-|165|
|FSO[triples]|-|1,560|-|32,024|
|Products[ms]|9|8|46|174|
|Products[triples]|218|85|3,635|16,012|

## Units
In the current setup, all units are as defined in the input model. Will be neutralized to the following in a future release:

|Measure |Unit|
|:-------|:--:|
|Distance|mm  |
|Area    |m2  |
|Volume  |m3  |