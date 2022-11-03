// import { helpers } from "../src";
import { helpers } from "../lib/bundles/bundle.esm";
import { validate as uuidValidate } from 'uuid';

describe('Helpers | uri-builder', () => {

    test('can build a URI from a known ID', async () => {

        // ARRANGE
        const globalId: string = "29xXpnz7z1Ku$Tf5h_evLy";

        // ACT
        const res = helpers.uriBuilder.defaultURIBuilder(globalId);

        // ASSERT
        expect(res).toBe("inst:29xXpnz7z1Ku%24Tf5h_evLy");
        expect(res).toBe(`inst:${encodeURIComponent(globalId)}`);

    });

    test('can build a context based URI', async () => {

        // Arrange
        const context1: string = "2c2VtaAcDE1BJDDFxxUc6bPOINTZ(0 100 300)";
        const context2: string = "2c2VtaAcDE1BJDDFxxUc6bPOINTZ(0 100 320)";

        // ACT
        const res1 = helpers.uriBuilder.contextBasedUUID(context1);
        const res2 = helpers.uriBuilder.contextBasedUUID(context2);

        // ASSERT
        expect(res1).toBe("inst:b4bb2bc0-e849-5947-8f0a-859068ec73a9");
        expect(res2).toBe("inst:24275132-196c-5fbe-a15b-9e6e388fcc2b");

    });

    test('can build a UUID URI (Revit GUID) from an IFC GlobalId', async () => {

        // Arrange
        const globalId: string = "29xXpnz7z1Ku$Tf5h_evLy";

        // ACT
        const res = await helpers.uriBuilder.uuidURIBuilder(globalId);
        const uuid = res.split(":")[1];

        // ASSERT
        expect(res).toBe("inst:89ee1cf1-f47f-4153-8fdd-a45afea3957c");
        expect(uuidValidate(uuid)).toBe(true);

    });

});