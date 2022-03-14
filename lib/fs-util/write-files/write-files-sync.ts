import { mkdirSync, writeFileSync as fsWriteFileSync } from 'fs'
import { resolve } from 'path'

import type {
    WriteFileInput,
    WriteFileOptions
} from './write-files-common'
import { defaultWriteFileOptions } from './write-files-common'

export function writeFilesSync(
    input: WriteFileInput[],
    options: WriteFileOptions = defaultWriteFileOptions
) {
    const basePath = resolve(...(options.basePathFragments ?? []))

    if (basePath) {
        mkdirSync(basePath, { recursive: true })
    }

    const writeFileSync = ({
        data,
        file
    }: WriteFileInput) => {
        fsWriteFileSync(
            resolve(basePath, file),
            data,
            options
        )
    }

    input.forEach(writeFileSync)
}
