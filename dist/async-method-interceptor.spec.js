"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const interceptor = require("./index");
const inversify = require("inversify");
const test_util_1 = require("./test-util");
describe("async method interceptor test", () => {
    let TestService = class TestService {
        invoke() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("invoke");
            });
        }
    };
    TestService = __decorate([
        inversify.injectable(), 
        __metadata('design:paramtypes', [])
    ], TestService);
    let interceptorCall = false;
    let TestInterceptor = (context) => __awaiter(this, void 0, void 0, function* () {
        console.log("intercept start");
        var result = yield context.proceed();
        console.log("intercept end");
        interceptorCall = true;
        return result;
    });
    it("weave TestInterceptor to TestService", test_util_1.testZone(() => __awaiter(this, void 0, void 0, function* () {
        const kernel = new inversify.Kernel();
        kernel.bind(TestService).to(TestService);
        kernel.applyMiddleware(interceptor.methodInterceptorMiddleware(kernel, {
            targetClass: /TestService/
        }, TestInterceptor));
        const testService = kernel.get(TestService);
        interceptorCall = false;
        yield testService.invoke();
        expect(interceptorCall).toBeTruthy();
    })));
});
