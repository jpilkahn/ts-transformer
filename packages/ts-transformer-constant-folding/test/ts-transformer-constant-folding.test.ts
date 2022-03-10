import { describe, test } from '@jest/globals'

import { makeExpect } from './expect'
import testSubject from '../ts-transformer-constant-folding'

const expect = makeExpect(testSubject)

describe('Operands should be folded, when', () => {
    test(
        'both are in-place `NumericLiteral` nodes',
        expect('numeric-literal.ts')
            .toBe(`const five = 5;
`)
    )
    test(
        'both are `Identifier` nodes holding `NumericLiteral` values',
        expect('identifier.ts')
            .toBe(
`const one = 1;
const two = 2;
const three = 3;
`)
    )
})
