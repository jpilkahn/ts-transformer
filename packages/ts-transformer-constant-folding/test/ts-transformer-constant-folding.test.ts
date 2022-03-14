import { describe, test } from '@jest/globals'

import { makeExpect } from '@jpilkahn/ts-transformer-testing'

import testSubject from '../ts-transformer-constant-folding'

const expect = makeExpect(testSubject)

const operatorStrings = ['+', '-', '*', '/', '**']
const expected3and2 = [5, 1, 6, 1.5, 9]

describe('Operands should be folded, when', () => {
    describe(
        'nodes are of type `NumericLiteral` (in-place)',
        () => {
            for (let i = 0; i < operatorStrings.length; i++) {
                test(
                    `and the operator is ${operatorStrings[i]}`,
                    expect(`const result = 3 ${operatorStrings[i]} 2`)
                    .toBe(`const result = ${expected3and2[i]};`)
                )
            }
        }
    )

    describe(
        'nodes are of type `Identifier` (holding `NumericLiteral` values)',
        () => {
            for (let i = 0; i < operatorStrings.length; i++) {
                test(
                    `and the operator is ${operatorStrings[i]}`,
                    expect(`const three = 3
const two = 2
const result = three ${operatorStrings[i]} two`)
                    .toBe(`const three = 3;
const two = 2;
const result = ${expected3and2[i]};`)
                )
            }
        }
    )
})
