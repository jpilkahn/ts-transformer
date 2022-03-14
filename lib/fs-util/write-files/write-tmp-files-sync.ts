import { prependTmpPathToOptions } from '../tmp-path'

import type {
    WriteFileInput,
    WriteFileOptions
} from './write-files-common'
import { defaultWriteFileOptions } from './write-files-common'
import { writeFilesSync } from './write-files-sync'

export function writeTmpFilesSync(
    input: WriteFileInput[],
    options: WriteFileOptions = defaultWriteFileOptions
) {
    writeFilesSync(
        input,
        prependTmpPathToOptions(options)
    )

    return
}
