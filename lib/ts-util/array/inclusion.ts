export function includes(
    array: unknown[],
    value: unknown
) { return array.includes(value) }

export function excludes(
    array: unknown[],
    value: unknown
) { return !includes(array, value) }
