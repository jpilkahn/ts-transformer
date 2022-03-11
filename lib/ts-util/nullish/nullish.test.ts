import { describe, expect, test } from '@jest/globals'

import { isNotNullish, isNullish } from './nullish'

const ref = {}

const nullish = [null, undefined]
const nonNullish = [99, "string", ref]

function testElements<TArgs extends unknown[]>(
    args: TArgs,
    fn: typeof isNotNullish | typeof isNullish,
    expected: boolean
) {
    return args.forEach((arg) => {
        test(
            `\`${expected}\` for ${arg}`,
            () => expect(fn(arg)).toBe(expected)
        )
    })
}

[isNotNullish, isNullish].forEach((fn) => {
    describe(`\`${fn.name}(value)\` should return`, () => {
        testElements(nullish, fn, fn === isNullish)
        testElements(nonNullish, fn, fn !== isNullish)
    })
})
