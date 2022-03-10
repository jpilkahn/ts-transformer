import { expect } from '@jest/globals'
import { resolve } from 'path'

import { compiler, ProgramTransformer } from './compile'

export function makeExpect(transformer: ProgramTransformer) {
    const compile = compiler(transformer)

    return (fixture: string) => ({
        toBe: (expected: string) => () => expect(
            compile(resolve(__dirname, 'fixture', fixture))
        ).toBe(expected)
    })
}
