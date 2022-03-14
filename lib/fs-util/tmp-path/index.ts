import tempDir from 'temp-dir'

import type { OptionsWithBasePathFragments } from '../common'

export const tmpPath = tempDir

export function prependTmpPath(...pathFragments: string[]) {
    return [tmpPath, ...pathFragments]
}

export function prependTmpPathToOptions<
    Options extends OptionsWithBasePathFragments
>(options: Options) {
    return {
        ...options,
        basePathFragments: prependTmpPath(...(options.basePathFragments ?? []))
    }
}
