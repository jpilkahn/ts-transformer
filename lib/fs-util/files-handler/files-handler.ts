import { resolve } from 'path'

import { BaseDirectory } from '../common'
import { removeFilesSync } from '../remove-files'
import { prependTmpPathToOptions } from '../tmp-path'
import type { WriteFileInput, WriteFileOptions } from '../write-files'
import {
    defaultWriteFileOptions,
    writeFiles,
    writeFilesSync
} from '../write-files'

export type PathOrWriteFileInput = string | WriteFileInput

export type FilesHandlerOptions = {
    baseDirectory?: BaseDirectory
} & WriteFileOptions

/// Wraps common file operations.
///
/// Retains information on the files operated on during instance lifetime so
/// far. Simplifies removal of previously created (temporary) files.
export class FilesHandler {
    private _files: Set<string> = new Set()
    private _options: FilesHandlerOptions

    /// @param options node's native `WriteFileOptions` supplemented by
    ///                wrapper specific `baseDirectory` and `basePathFragments`
    ///                properties
    constructor(
        options: FilesHandlerOptions = defaultWriteFileOptions
    ) {
        switch (options.baseDirectory) {
            case BaseDirectory.TemporaryFsMount:
                this._options = prependTmpPathToOptions(options)
                break

            default:
                this._options = options
        }
    }

    /// Retieve an array of absolute paths to known handled files.
    absolutePaths() {
        return Array.from(this._files.values()).map(
            (relativePath: string) => resolve(
                ...(this._options.basePathFragments || []), relativePath
            )
        )
    }

    /// Add a file to known handled files.
    registerFile = (file: PathOrWriteFileInput) => {
        this._files.add(
            typeof file === 'string'
                ? file
                : file.file
        )
    }

    /// Add files to known handled files.
    registerFiles(files: PathOrWriteFileInput[]) {
        files.forEach(this.registerFile)
    }

    /// Removes known handled files from the file system.
    ///
    /// TODO: This should also remove previously created directories.
    remove() {
        removeFilesSync(
            Array.from(this._files.values()),
            this._options
        )
    }

    /// Write to several files on disk.
    async write(input: WriteFileInput[]) {
        this.registerFiles(input)

        return writeFiles(input, this._options)
    }

    /// Write to several files on disk.
    writeSync(input: WriteFileInput[]) {
        this.registerFiles(input)

        writeFilesSync(input, this._options)
    }
}
