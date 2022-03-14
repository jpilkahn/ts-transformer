import { expect } from '@jest/globals'

import {
    ProgramTransformer,
    TransformerTestingCompiler,
    TransformerTestingCompilerOptions
} from './compiler'

function guaranteeTerminatingEol(value: string) {
    return `${value}${value.endsWith('\n') ? '' : '\n'}`
}

export function makeExpect(
    transformer: ProgramTransformer,
    options: TransformerTestingCompilerOptions = (
        TransformerTestingCompiler.defaultOptions
    )
) {
    const compiler = new TransformerTestingCompiler(transformer, options)

    return (input: string) => ({
        toBe: (expected: string) => () => expect(
            compiler.compile(input)
        ).toBe(guaranteeTerminatingEol(expected))
    })
}
