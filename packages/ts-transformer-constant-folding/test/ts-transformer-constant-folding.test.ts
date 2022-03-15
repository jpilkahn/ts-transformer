import { describe, test } from '@jest/globals'

import { makeExpect } from '@jpilkahn/ts-transformer-testing'
import { nextElementWrapped } from '@jpilkahn/ts-util'

import transformer from '../ts-transformer-constant-folding'

const expect = makeExpect({
    before: [transformer],
    afterDeclarations: [transformer]
})

const operatorStrings = ['+', '-', '*', '/', '**']
const expected32 = [5, 1, 6, 1.5, 9]

describe('Operands should be correctly folded, when', () => {
    describe(
        '2 nodes are of type `NumericLiteral` (in-place)',
        () => {
            for (let i = 0; i < operatorStrings.length; i++) {
                const operator = operatorStrings[i]

                test(
                    `and the operator is ${operator}`,
                    expect(`const result = 3 ${operator} 2`)
                    .toBe(`const result = ${expected32[i]};`)
                )
            }
        }
    )

    describe(
        '2 nodes are of type `Identifier` (holding `NumericLiteral` values)',
        () => {
            for (let i = 0; i < operatorStrings.length; i++) {
                const operator = operatorStrings[i]

                test(
                    `and the operator is ${operator}`,
                    expect(`const three = 3
const two = 2
const result = three ${operator} two`)
                    .toBe(`const three = 3;
const two = 2;
const result = ${expected32[i]};`)
                )
            }
        }
    )

    describe(
        '3 nodes are of either `Identifier` or `NumericLiteral` type',
        () => {
            const expected = [1, -5, 1.5, 3/16, 13]

            for (let i = 0; i < operatorStrings.length; i++) {
                const operatorA = operatorStrings[i]
                const operatorB = nextElementWrapped(operatorStrings, i)

                test(
                    `and the operators are ${operatorA} and ${operatorB}`,
                    expect(`const three = 3
const two = 2
const result = three ${operatorA} two ${operatorB} 4`)
                    .toBe(`const three = 3;
const two = 2;
const result = ${expected[i]};`)
                )
            }
        }
    )

    describe(
        '4 nodes contain parenthesized expressions',
        () => {
            const expected = [-3, .5, 6/16, 1.5**6, 7]

            for (let i = 0; i < operatorStrings.length; i++) {
                const operatorA = operatorStrings[i]
                const operatorB = nextElementWrapped(operatorStrings, i)
                const operatorC = nextElementWrapped(operatorStrings, i, 2)

                test(
                    `and the operators are ${operatorA}, ${operatorB} and ${operatorC}`,
                    expect(`const three = 3
const two = 2
const result = ((three ${operatorA} (2)) ${operatorB} ((two) ${operatorC} 4))`)
                    .toBe(`const three = 3;
const two = 2;
const result = ${expected[i]};`)
                )
            }
        }
    )
})
