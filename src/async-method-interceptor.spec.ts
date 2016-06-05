import * as interceptor from "./index";
import * as inversify  from "inversify";
import {testZone} from "./test-util";

describe("async method interceptor test", () => {

    @inversify.injectable()
    class TestService {
        async invoke() {
            console.log("invoke");
        }
    }

    let interceptorCall = false;
    let TestInterceptor: interceptor.AsyncMethodInterceptor = async (context) => {
        console.log("intercept start");
        var result = await context.proceed();
        console.log("intercept end");
        interceptorCall = true;
        return result;
    };

    it("wave interceptor to TestSErvice",
        testZone(async () => {
            const kernel = new inversify.Kernel();
            kernel.bind(TestService).to(TestService);
            kernel.applyMiddleware(
                interceptor.methodInterceptorMiddleware(kernel, {
                    targetClass: /TestService/
                }, TestInterceptor)
            );

            const testService = kernel.get(TestService);
            interceptorCall = false;
            await testService.invoke();
            expect(interceptorCall).toBeTruthy();

        }));
});