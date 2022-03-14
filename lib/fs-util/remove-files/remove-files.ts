import { each as asyncEach } from 'async'
import type { NoParamCallback } from 'fs'
import { unlink } from 'fs'
import { resolve } from 'path'

import type { RemoveFileOptions } from './remove-files-common'
import { defaultRemoveFileOptions } from './remove-files-common'

export async function removeFiles(
    files: string[],
    options: RemoveFileOptions = defaultRemoveFileOptions
) {
    const removeFile = (
        file: string,
        callback: NoParamCallback
    ) => {
        unlink(
            resolve(...(options.basePathFragments || []), file),
            callback
        )
    }

    try {
        await asyncEach(files, removeFile)
    } catch(err) {
        console.log(err)
    }
}
