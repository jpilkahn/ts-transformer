import type { WriteFileOptions as FsWriteFileOptions } from 'fs'

import type { OptionsWithBasePathFragments } from '../common'

export type WriteFileInput = {
    data: string,
    file: string
}

export type WriteFileOptions = (
    FsWriteFileOptions & OptionsWithBasePathFragments
)

export const defaultWriteFileOptions: WriteFileOptions = {
    basePathFragments: []
}
