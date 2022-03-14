import { excludes, includes } from '../array'

const nullishValues = [null, undefined]

export type Nullish = (typeof nullishValues)[number]

export type NonNullish<T> = Exclude<T, Nullish>

export type ExcludeNullishProps<T> = { [P in keyof T]-?: ExcludeNullishProps<NonNullish<T[P]>> }

export function isNotNullish<T>(value: T | Nullish): value is T {
    return excludes(nullishValues, value)
}

export function isNullish<T>(value: T | Nullish): value is Nullish {
    return includes(nullishValues, value)
}
