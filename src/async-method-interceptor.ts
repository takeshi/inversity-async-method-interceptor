require("reflect-metadata");
import * as inversify from "inversify";

export class AsyncInvocationContext {

    constructor(public kernel: inversify.IKernel, public applyThis: any, public applyArgs: any, public targetMethod: Function) {
    }

    async proceed() {
        return await this.targetMethod.apply(this.applyThis, this.applyArgs);
    }

    get className(): string {
        return this.applyThis.constructor.name;
    }

    get methodName(): string {
        return this.targetMethod.name;
    }

}

export interface AsyncMethodInterceptor {
    (context: AsyncInvocationContext): Promise<any>;
}

export interface AsyncMethodInterceptorPattern {
    targetClass?: RegExp;
    excludeClass?: RegExp;
    targetMethod?: RegExp;
    excludeMethod?: RegExp;
}

@inversify.injectable()
export class AsyncMethodInterceptorConfig {
    pattern: AsyncMethodInterceptorPattern;
    interceptors: AsyncMethodInterceptor[];
}

export function AsyncMethodInterceptorModule(config: AsyncMethodInterceptorConfig): inversify.IKernelModule {
    return (kernel) => {
        kernel.bind(AsyncMethodInterceptorConfig).toConstantValue(config);
    }
}