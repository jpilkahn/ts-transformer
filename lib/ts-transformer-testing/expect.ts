import { expect } from '@jest/globals'

import {
    ProgramTransformersByStage,
    TransformerTestingCompiler,
    TransformerTestingCompilerOptions
} from './compiler'

function guaranteeTerminatingEol(value: string) {
    return `${value}${value.endsWith('\n') ? '' : '\n'}`
}

export function makeExpect(
    transformers: ProgramTransformersByStage,
    options: TransformerTestingCompilerOptions = (
        TransformerTestingCompiler.defaultOptions
    )
) {
    const compiler = new TransformerTestingCompiler(transformers, options)

    return (input: string) => ({
        toBe: (expected: string) => () => expect(
            compiler.compile(input)
        ).toBe(guaranteeTerminatingEol(expected))
    })
}
