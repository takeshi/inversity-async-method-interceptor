export declare function delay(time: number): Promise<void>;
export interface TestZoneOption {
    expectError: boolean;
}
export declare function testZone(fn: () => Promise<void>, option?: TestZoneOption): (done: any) => void;
