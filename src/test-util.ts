'use strict';
require("reflect-metadata");
require('zone.js');
import * as util from 'util';

export function delay(time: number): Promise<void> {
    return new Promise<void>((r) => {
        setTimeout(() => {
            r();
        }, time);
    });
}

export interface TestZoneOption {
    expectError: boolean;
}

function getRejection(error: any) {
    if (error.rejection) {
        return getRejection(error.rejection);
    }
    return error;
}

export function testZone(fn: () => Promise<void>, option?: TestZoneOption) {
    option = option || {} as TestZoneOption;
    return (done) => {
        let throwsError = false;
        let testZone = Zone.current.fork({
            name: 'jasmine test',
            onHandleError: (parentZoneDelegate: ZoneDelegate, currentZone: Zone, targetZone: Zone, error: any) => {
                throwsError = true;
                console.log('onHandleError', getRejection(error).stack);
                if (!option.expectError) {
                    console.error(getRejection(error).stack);
                    fail(util.inspect(getRejection(error).rejection));
                }
                done();
                return false;
            }
        });
        testZone.runGuarded(async () => {
            await fn();
            if (!throwsError && option.expectError) {
                fail("don't throw exception");
            }
            done();
        });
    };
}