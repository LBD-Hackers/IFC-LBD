import { LBDParser } from '.';
export declare class CLITool {
    argv: any;
    init(): Promise<any>;
    parseFile(lbdParser: LBDParser): Promise<void>;
    private parseTriples;
    private serialize;
}
