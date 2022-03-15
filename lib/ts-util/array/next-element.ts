export function nextElement(
    array: unknown[],
    index: number,
    step: number = 1
) {
    const elementIndex = index + step

    return (
        elementIndex < array.length
            ? array[elementIndex]
            : undefined
    )
}

export function nextElementWrapped(
    array: unknown[],
    index: number,
    step: number = 1
) {
    return array[(index + step) % array.length]
}
