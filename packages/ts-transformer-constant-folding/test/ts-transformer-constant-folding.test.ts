import { describe, test } from '@jest/globals'

import { makeExpect } from '@jpilkahn/ts-transformer-testing'
import { nextElementWrapped } from '@jpilkahn/ts-util'

import testSubject from '../ts-transformer-constant-folding'

const expect = makeExpect(testSubject)

const operatorStrings = ['+', '-', '*', '/', '**']
const expected32 = [5, 1, 6, 1.5, 9]
const expected324 = [1, -5, 1.5, 3/16, 13]

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
const result = ${expected324[i]};`)
                )
            }
        }
    )
})
