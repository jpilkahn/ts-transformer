import { prependTmpPathToOptions } from '../tmp-path'

import type { RemoveFileOptions } from './remove-files-common'
import { defaultRemoveFileOptions } from './remove-files-common'
import { removeFiles } from './remove-files'

export async function removeTmpFiles(
    files: string[],
    options: RemoveFileOptions = defaultRemoveFileOptions
) {
    await removeFiles(
        files,
        prependTmpPathToOptions(options)
    )
}
