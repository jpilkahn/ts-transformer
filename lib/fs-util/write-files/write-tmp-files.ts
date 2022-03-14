import { prependTmpPathToOptions } from '../tmp-path'

import type {
    WriteFileInput,
    WriteFileOptions
} from './write-files-common'
import { defaultWriteFileOptions } from './write-files-common'
import { writeFiles } from './write-files'

export async function writeTmpFiles(
    input: WriteFileInput[],
    options: WriteFileOptions = defaultWriteFileOptions
) {
    await writeFiles(
        input,
        prependTmpPathToOptions(options)
    )

    return
}
