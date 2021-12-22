"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BOTParser = void 0;

var _pathSearch = require("../helpers/path-search");

var _webIfc = require("web-ifc");

var _classAssignment = require("../helpers/class-assignment");

var _parser = require("./parser");

class BOTParser extends _parser.Parser {
  async doParse() {
    this.verbose && console.log("Started BOT parsing");
    this.verbose && console.log("");
    console.time("Finished BOT parsing"); // Class assignment

    this.verbose && console.log("## STEP 1: CLASS ASSIGNMENT ##");
    this.verbose && console.time("1/12: Finding sites");
    this.jsonLDObject["@graph"].push(...(await this.buildSites()));
    this.verbose && console.timeEnd("1/12: Finding sites");
    this.verbose && console.time("2/12: Finding buildings");
    this.jsonLDObject["@graph"].push(...(await this.buildBuildings()));
    this.verbose && console.timeEnd("2/12: Finding buildings");
    this.verbose && console.time("3/12: Finding storeys");
    this.jsonLDObject["@graph"].push(...(await this.buildStoreys()));
    this.verbose && console.timeEnd("3/12: Finding storeys");
    this.verbose && console.time("4/12: Finding spaces");
    this.jsonLDObject["@graph"].push(...(await this.buildSpaces()));
    this.verbose && console.timeEnd("4/12: Finding spaces");
    this.verbose && console.time("5/12: Finding elements");
    this.jsonLDObject["@graph"].push(...(await this.buildElements()));
    this.verbose && console.timeEnd("5/12: Finding elements");
    this.verbose && console.log(""); // Space-Element relationships

    this.verbose && console.log("## STEP 2: SPACE-ELEMENT RELATIONSHIPS ##");
    this.verbose && console.time("6/12: Finding spaces' adjacent elements");
    this.jsonLDObject["@graph"].push(...(await this.buildSpaceAdjacentElementRelationships()));
    this.verbose && console.timeEnd("6/12: Finding spaces' adjacent elements");
    this.verbose && console.time("7/12: Finding spaces' contained elements");
    this.jsonLDObject["@graph"].push(...(await this.buildSpaceContainedElementRelationships()));
    this.verbose && console.timeEnd("7/12: Finding spaces' contained elements");
    this.verbose && console.time("8/12: Finding storeys' elements");
    this.jsonLDObject["@graph"].push(...(await this.buildStoreyElementRelationships()));
    this.verbose && console.timeEnd("8/12: Finding storeys' elements");
    this.verbose && console.log(""); // Element-element relationships

    this.verbose && console.log("## STEP 3: ELEMENT-ELEMENT RELATIONSHIPS ##");
    this.verbose && console.time("9/12: Finding elements' hosted elements");
    this.jsonLDObject["@graph"].push(...(await this.buildHostedElementRelationships()));
    this.verbose && console.timeEnd("9/12: Finding elements' hosted elements");
    this.verbose && console.log(""); // Zone containment

    this.verbose && console.log("## STEP 4: ZONE-ZONE RELATIONSHIPS ##");
    this.verbose && console.time("10/12: Finding storeys' spaces");
    this.jsonLDObject["@graph"].push(...(await this.buildStoreySpaceRelationships()));
    this.verbose && console.timeEnd("10/12: Finding storeys' spaces");
    this.verbose && console.time("11/12: Finding buildings' storeys");
    this.jsonLDObject["@graph"].push(...(await this.buildBuildingStoreyRelationships()));
    this.verbose && console.timeEnd("11/12: Finding buildings' storeys");
    this.verbose && console.time("12/12: Finding sties' buildings");
    this.jsonLDObject["@graph"].push(...(await this.buildSiteBuildingRelationships()));
    this.verbose && console.timeEnd("12/12: Finding sties' buildings");
    this.verbose && console.log("");
    console.timeEnd("Finished BOT parsing");

    if (this.verbose) {
      const tripleCount = await this.getTripleCount();
      console.log("Total triples: " + tripleCount);
    }

    return await this.getTriples();
  }
  /**
   * CLASS ASSIGNMENT
   */


  async buildSites() {
    return await (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCSITE, ["bot:Site"]);
  }

  async buildBuildings() {
    return await (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCBUILDING, ["bot:Building"]);
  }

  async buildStoreys() {
    return await (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCBUILDINGSTOREY, ["bot:Storey"]);
  }

  async buildSpaces() {
    return await (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCSPACE, ["bot:Space"]);
  }

  async buildElements() {
    const includeSubTypes = true;
    return await (0, _classAssignment.buildClassInstances)(this.ifcAPI, this.modelID, _webIfc.IFCELEMENT, ["bot:Element"], includeSubTypes);
  }
  /**
   * ZONE-ELEMENT-RELATIONSHIPS
   */


  async buildSpaceAdjacentElementRelationships() {
    const subjectRef = "RelatingSpace";
    const targetRef = "RelatedBuildingElement";
    const rdfRelationship = "bot:adjacentElement";
    return await (0, _pathSearch.buildRelOneToOne)(this.ifcAPI, this.modelID, _webIfc.IFCRELSPACEBOUNDARY, subjectRef, targetRef, rdfRelationship, true);
  }

  async buildSpaceContainedElementRelationships() {
    const subjectRef = "RelatingStructure";
    const targetRef = "RelatedElements";
    const rdfRelationship = "bot:containsElement";
    const subjectClass = _webIfc.IFCSPACE;
    return await (0, _pathSearch.buildRelOneToMany)(this.ifcAPI, this.modelID, _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE, subjectRef, targetRef, rdfRelationship, subjectClass);
  }

  async buildStoreyElementRelationships() {
    const subjectRef = "RelatingStructure";
    const targetRef = "RelatedElements";
    const rdfRelationship = "bot:hasElement";
    const subjectClass = _webIfc.IFCBUILDINGSTOREY;
    return await (0, _pathSearch.buildRelOneToMany)(this.ifcAPI, this.modelID, _webIfc.IFCRELCONTAINEDINSPATIALSTRUCTURE, subjectRef, targetRef, rdfRelationship, subjectClass);
  }
  /**
   * ELEMENT-ELEMENT-RELATIONSHIPS
   */


  async buildHostedElementRelationships() {
    const subjectRef = "RelatingBuildingElement";
    const targetRef = "RelatedOpeningElement";
    const rdfRelationship = "bot:hasSubElement";
    return await (0, _pathSearch.buildRelOneToOne)(this.ifcAPI, this.modelID, _webIfc.IFCRELVOIDSELEMENT, subjectRef, targetRef, rdfRelationship);
  }
  /**
   * ZONE-CONTAINMENT
   */


  async buildStoreySpaceRelationships() {
    const subjectRef = "RelatingObject";
    const targetRef = "RelatedObjects";
    const rdfRelationship = "bot:hasSpace";
    const subjectClass = _webIfc.IFCBUILDINGSTOREY;
    const targetClass = _webIfc.IFCSPACE;
    return await (0, _pathSearch.buildRelOneToMany)(this.ifcAPI, this.modelID, _webIfc.IFCRELAGGREGATES, subjectRef, targetRef, rdfRelationship, subjectClass, targetClass);
  }

  async buildBuildingStoreyRelationships() {
    const subjectRef = "RelatingObject";
    const targetRef = "RelatedObjects";
    const rdfRelationship = "bot:hasStorey";
    const subjectClass = _webIfc.IFCBUILDING;
    const targetClass = _webIfc.IFCBUILDINGSTOREY;
    return await (0, _pathSearch.buildRelOneToMany)(this.ifcAPI, this.modelID, _webIfc.IFCRELAGGREGATES, subjectRef, targetRef, rdfRelationship, subjectClass, targetClass);
  }

  async buildSiteBuildingRelationships() {
    const subjectRef = "RelatingObject";
    const targetRef = "RelatedObjects";
    const rdfRelationship = "bot:hasBuilding";
    const subjectClass = _webIfc.IFCSITE;
    const targetClass = _webIfc.IFCBUILDING;
    return await (0, _pathSearch.buildRelOneToMany)(this.ifcAPI, this.modelID, _webIfc.IFCRELAGGREGATES, subjectRef, targetRef, rdfRelationship, subjectClass, targetClass);
  }

}

exports.BOTParser = BOTParser;
//# sourceMappingURL=bot-parser.js.map