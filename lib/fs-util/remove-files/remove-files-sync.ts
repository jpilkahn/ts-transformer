import { unlinkSync } from 'fs'
import { resolve } from 'path'

import type { RemoveFileOptions } from './remove-files-common'
import { defaultRemoveFileOptions } from './remove-files-common'

export async function removeFilesSync(
    files: string[],
    options: RemoveFileOptions = defaultRemoveFileOptions
) {
    const removeFile = (
        file: string
    ) => {
        unlinkSync(
            resolve(...(options.basePathFragments || []), file)
        )
    }

    files.forEach(removeFile)
}
