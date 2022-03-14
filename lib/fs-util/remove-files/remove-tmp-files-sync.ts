import { prependTmpPathToOptions } from '../tmp-path'

import type { RemoveFileOptions } from './remove-files-common'
import { defaultRemoveFileOptions } from './remove-files-common'
import { removeFilesSync } from './remove-files-sync'

export function removeTmpFilesSync(
    files: string[],
    options: RemoveFileOptions = defaultRemoveFileOptions
) {
    removeFilesSync(
        files,
        prependTmpPathToOptions(options)
    )
}
