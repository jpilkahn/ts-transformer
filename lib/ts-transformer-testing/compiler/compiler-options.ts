import * as ts from 'typescript'

import { isNotNullish } from '@jpilkahn/ts-util'

type PartialOptions = Partial<ts.CompilerOptions>

export const defaultCompilerOptions: PartialOptions = {
    module: ts.ModuleKind.ES2015,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    stripInternal: true,
    target: ts.ScriptTarget.ES2015
}

function definedKeys<T>(obj: T) {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, value]) => isNotNullish(value)
        )
    )
}

export function withDefaults(options: PartialOptions) {
    return {
        ...defaultCompilerOptions,
        ...definedKeys(options)
    }
}
