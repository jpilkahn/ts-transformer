import { expect } from '@jest/globals'
import { resolve } from 'path'

import { compiler, ProgramTransformer } from './compile'

export function makeExpect(
    transformer: ProgramTransformer,
    ...basePathSegments: string[]
) {
    const compile = compiler(transformer)

    return (relpath: string) => ({
        toBe: (expected: string) => () => expect(
            compile(resolve(...basePathSegments, relpath))
        ).toBe(expected)
    })
}
