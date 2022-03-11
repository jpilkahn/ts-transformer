import { describe, expect, test } from '@jest/globals'

import { excludes, includes } from './array'

const refA = {}
const refB = {}

const baseA = [99, "string", refA]
const baseB = [100, "other", refB]

const arrayA = [...baseA, baseA]
const arrayB = [...baseB, baseB]

function testElements<TArray extends unknown[]>(
    array: TArray,
    fn: typeof excludes | typeof includes,
    expected: boolean
) {
    return array.forEach((element) => {
        test(
            `\`${expected}\` for ${element}`,
            () => expect(fn(arrayA, element)).toBe(expected)
        )
    })
}

[excludes, includes].forEach((fn) => {
    describe(`\`${fn.name}([${arrayA}], value)\` should return`, () => {
        testElements(arrayA, fn, fn === includes)
        testElements(arrayB, fn, fn !== includes)
    })
})
