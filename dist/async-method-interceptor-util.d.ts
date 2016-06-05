import { AsyncMethodInterceptor, AsyncMethodInterceptorPattern } from "./async-method-interceptor";
export declare function methodInterceptorMiddleware(kernel: inversify.IKernel, pattern: AsyncMethodInterceptorPattern, interceptor: AsyncMethodInterceptor): (planAndResolve: inversify.PlanAndResolve<any>) => inversify.PlanAndResolve<any>;
