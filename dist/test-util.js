'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
require("reflect-metadata");
require('zone.js');
const util = require('util');
function delay(time) {
    return new Promise((r) => {
        setTimeout(() => {
            r();
        }, time);
    });
}
exports.delay = delay;
function getRejection(error) {
    if (error.rejection) {
        return getRejection(error.rejection);
    }
    return error;
}
function testZone(fn, option) {
    option = option || {};
    return (done) => {
        let throwsError = false;
        let testZone = Zone.current.fork({
            name: 'jasmine test',
            onHandleError: (parentZoneDelegate, currentZone, targetZone, error) => {
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
        testZone.runGuarded(() => __awaiter(this, void 0, void 0, function* () {
            yield fn();
            if (!throwsError && option.expectError) {
                fail("don't throw exception");
            }
            done();
        }));
    };
}
exports.testZone = testZone;
