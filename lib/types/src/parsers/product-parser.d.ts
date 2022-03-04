import { Parser } from "./parser";
import { JSONLD } from "../helpers/BaseDefinitions";
export declare class ProductParser extends Parser {
    doParse(): Promise<JSONLD | string>;
    private buildProducts;
    private buildProductTypes;
    private assignProductType;
}
//# sourceMappingURL=product-parser.d.ts.map