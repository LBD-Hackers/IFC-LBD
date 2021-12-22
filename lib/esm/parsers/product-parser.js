"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductParser = void 0;

var _webIfc = require("web-ifc");

var _classAssignment = require("../helpers/class-assignment");

var _parser = require("./parser");

var _uriBuilder = require("../helpers/uri-builder");

var _IfcElementsMap = require("../helpers/IfcElementsMap");

class ProductParser extends _parser.Parser {
  async doParse() {
    this.verbose && console.log("Started PRODUCTS parsing");
    this.verbose && console.log("");
    console.time("Finished products parsing");
    this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
    this.verbose && console.time("1/1: Finding products");
    this.jsonLDObject["@graph"] = await this.buildProducts();
    this.verbose && console.timeEnd("1/1: Finding products");
    this.verbose && console.log("");
    console.timeEnd("Finished products parsing");

    if (this.verbose) {
      const tripleCount = await this.getTripleCount();
      console.log("Total triples: " + tripleCount);
    }

    return await this.getTriples();
  }

  async buildProducts() {
    const graph = [];
    const skippedTypes = [_webIfc.IFCOPENINGELEMENT]; // Get all subTypes of IfcElement

    const subTypes = (0, _classAssignment.getElementSubtypes)(_webIfc.IFCELEMENT).filter(typeID => skippedTypes.indexOf(typeID) == -1); // Filter out skipped types
    // Get all items in model that belong to any of these types

    let expressIDArray = [];

    for (let typeId of subTypes) {
      expressIDArray.push(...(await this.ifcAPI.properties.getAllItemsOfType(this.modelID, typeId, false)));
    }

    for (let i = 0; i < expressIDArray.length; i++) {
      const expressID = expressIDArray[i];
      const {
        type,
        GlobalId
      } = await this.ifcAPI.properties.getItemProperties(this.modelID, expressID);
      const URI = (0, _uriBuilder.defaultURIBuilder)(GlobalId.value); // Push product

      graph.push({
        "@id": URI,
        "@type": `ifc:${_IfcElementsMap.IfcElements[type]}`
      });
    }

    return graph;
  }

}

exports.ProductParser = ProductParser;
//# sourceMappingURL=product-parser.js.map