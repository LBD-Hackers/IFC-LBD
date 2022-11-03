// import { helpers } from "../src";
import { helpers } from "../lib/bundles/bundle.esm";
import { validate as uuidValidate } from 'uuid';

describe('Helpers | guid-tools', () => {

    test('can convert IFC GlobalId to Revit UUID', async () => {

        // ARRANGE
        const globalId: string = "29xXpnz7z1Ku$Tf5h_evLy";

        // ACT
        const revitUUID = await helpers.guidTools.ifcGlobalIdToRevitGuid(globalId);

        // ASSERT
        expect(revitUUID).toBe("89ee1cf1-f47f-4153-8fdd-a45afea3957c");
        expect(uuidValidate(revitUUID)).toBe(true);

    });

    test('can convert Revit GUID to IFC GlobalId', async () => {

        // ARRANGE
        const revitUUID: string = "29xXpnz7z1Ku$Tf5h_evLy";

        // ACT
        const globalId = await helpers.guidTools.ifcGlobalIdToRevitGuid(revitUUID);

        // ASSERT
        expect(globalId).toBe("89ee1cf1-f47f-4153-8fdd-a45afea3957c");

    });

    test('can convert Revit UniqueId to Revit GUID', async () => {

        // ARRANGE
        const revitUniqueId: string = "c71cffa8-2bb5-4842-bd34-f25c022997b1-000718b1";

        // ACT
        const revitUUID = helpers.guidTools.revitUniqueIdToRevitGuid(revitUniqueId);

        // ASSERT
        expect(revitUUID).toBe("c71cffa8-2bb5-4842-bd34-f25c022e8f00");
        expect(uuidValidate(revitUUID)).toBe(true);

    });

    test('Create new IFC GlobalId', async () => {

        // ACT
        const globalId = helpers.guidTools.createIfcGlobalId();

        // ASSERT
        expect(globalId.length).toBe(22);

    });

    test('Create context based GUID', async () => {

        // Arrange
        const context1: string = "2c2VtaAcDE1BJDDFxxUc6bPOINTZ(0 100 300)";
        const context2: string = "2c2VtaAcDE1BJDDFxxUc6bPOINTZ(0 100 320)";

        // ACT
        const guid1 = helpers.guidTools.contextBasedGuid(context1);
        const guid2 = helpers.guidTools.contextBasedGuid(context2);

        // ASSERT
        expect(guid1).toBe("b4bb2bc0-e849-5947-8f0a-859068ec73a9");
        expect(guid2).toBe("24275132-196c-5fbe-a15b-9e6e388fcc2b");

    });

});