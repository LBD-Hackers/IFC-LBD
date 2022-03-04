import * as WebIFC from "web-ifc/web-ifc-api.js";
import { IFCUNITASSIGNMENT } from 'web-ifc';

// Known types that are currently unsupported
// TIMEUNIT = 'TIMEUNIT',
// PLANEANGLEUNIT = 'PLANEANGLEUNIT'

export enum UnitType {
  LENGTHUNIT = 'LENGTHUNIT',
  AREAUNIT = 'AREAUNIT',
  VOLUMEUNIT = 'VOLUMEUNIT'
}

export const UnitScale: { [unit: string]: number } = {
  MILLI: 0.001,
  CENTI: 0.01,
  DECI: 0.1,
  NONE: 1,
  DECA: 10,
  HECTO: 100,
  KILO: 1000
};

export const ucumPrefix: { [unit: string]: string } = {
  "0.001": "m",
  "0.01": "c",
  "0.1": "d",
  "1": "",
  "1000": "k"
};

export function getUCUMCode(unitType: UnitType, multiplicationFactor: number): string{
  const pfx = ucumPrefix[multiplicationFactor];
  if(unitType == UnitType.LENGTHUNIT) return `${pfx}m`;
  if(unitType == UnitType.AREAUNIT) return `${pfx}m2`;
  if(unitType == UnitType.VOLUMEUNIT) return `${pfx}m3`;
}

export class IfcUnits {

  allUnits: { [modelID: number]: any } = {};
  private ifcAPI: WebIFC.IfcAPI;

  constructor(ifcAPI: WebIFC.IfcAPI) {
    this.ifcAPI = ifcAPI;
  }

  async getUnits(modelID: number, type: UnitType) {
    if (!this.allUnits[modelID]) {
      await this.getUnitsOfModel(modelID);
    }
    return this.allUnits[modelID][type];
  }

  async getUnitsOfModel(modelID: number) {
    this.allUnits[modelID] = {};

    const foundUnitsID = await this.ifcAPI.properties.getAllItemsOfType(modelID, IFCUNITASSIGNMENT, false);
    const unitsID = foundUnitsID[0];
    const unitReference = await this.ifcAPI.properties.getItemProperties(modelID, unitsID, true);
    const units = unitReference.Units;

    Object.values(UnitType).forEach((value) => {
      const foundUnit = units.find(
        (item: any) => item.UnitType && item.UnitType.value === value
      );

      if (foundUnit) {
        const prefix = foundUnit.Prefix as any;
        let scale;
        if (prefix === null) scale = UnitScale.NONE;
        else scale = UnitScale[prefix.value];
        this.allUnits[modelID][value] = scale;
      }
    });

    return this.allUnits[modelID];

  }
}