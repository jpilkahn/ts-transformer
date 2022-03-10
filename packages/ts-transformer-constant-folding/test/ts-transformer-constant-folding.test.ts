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

    test(
        'the operation is an addition (operator is `SyntaxKind.PlusToken`)',
        expect('plus-token.ts')
            .toBe(`const plus = 5;
`)
    )

    test(
        'the operation is a subtraction (operator is `SyntaxKind.MinusToken`)',
        expect('minus-token.ts')
            .toBe(`const minus = 1;
`)
    )

    test(
        'the operation is a multiplication (operator is `SyntaxKind.AsteriskToken`)',
        expect('asterisk-token.ts')
            .toBe(`const asterisk = 6;
`)
    )

    test(
        'the operation is a division (operator is `SyntaxKind.SlashToken`)',
        expect('slash-token.ts')
            .toBe(`const slash = 1.5;
`)
    )

    test(
        'the operation is an exponentiation (operator is `SyntaxKind.AsteriskAsteriskToken`)',
        expect('asterisk-asterisk-token.ts')
            .toBe(`const asteriskAsterisk = 9;
`)
    )
})
