import type { NoParamCallback } from 'fs'

import { each as asyncEach } from 'async'
import { mkdirSync, writeFile as fsWriteFile } from 'fs'
import { resolve } from 'path'

import type {
    WriteFileInput,
    WriteFileOptions
} from './write-files-common'
import { defaultWriteFileOptions } from './write-files-common'

export async function writeFiles(
    input: WriteFileInput[],
    options: WriteFileOptions = defaultWriteFileOptions
) {
    const basePath = resolve(...(options.basePathFragments ?? []))

    if (basePath) {
        try {
            mkdirSync(basePath, { recursive: true })
        } catch (err) {
            console.log(err)

            return
        }
    }

    const writeFile = (
        { data, file }: WriteFileInput,
        callback: NoParamCallback
    ) => {
        fsWriteFile(
            resolve(basePath, file),
            data,
            callback
        )
    }

    try {
        await asyncEach(input, writeFile)
    } catch(err) {
        console.log(err)
    }
}
