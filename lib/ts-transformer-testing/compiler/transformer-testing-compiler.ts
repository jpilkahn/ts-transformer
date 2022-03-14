import { sync as globSync } from 'glob'
import { resolve } from 'path'
import * as ts from 'typescript'

import type { OptionsWithBasePathFragments } from '@jpilkahn/fs-util'
import { BaseDirectory, FilesHandler } from '@jpilkahn/fs-util'
import { assertUnreachable } from '@jpilkahn/ts-util'

import { logDiagnostics } from '../diagnostics'

import type { CompilationInput, ProgramTransformer } from './compiler-common'
import { CompilationInputKind } from './compiler-common'
import { defaultCompilerOptions, withDefaults } from './compiler-options'

export type TransformerTestingCompilerOptions = (
    Partial<ts.CompilerOptions>
    & OptionsWithBasePathFragments
    & { inputKind: CompilationInputKind }
)

export class TransformerTestingCompiler {
    static readonly defaultInputKind = CompilationInputKind.Source
    static readonly defaultOptions: TransformerTestingCompilerOptions = {
        ...defaultCompilerOptions,
        inputKind: TransformerTestingCompiler.defaultInputKind
    }

    private _filesHandler?: FilesHandler
    private _options: TransformerTestingCompilerOptions
    private _transformer!: ProgramTransformer

    constructor(
        transformer: ProgramTransformer,
        options: TransformerTestingCompilerOptions = (
            TransformerTestingCompiler.defaultOptions
        )
    ) {
        this._options = options
        this._transformer = transformer
    }

    private __setup(
        input: CompilationInput,
        inputKind: CompilationInputKind = this._options.inputKind
    ) {
        switch (inputKind) {
            case CompilationInputKind.FileGlobPattern:
                return globSync(
                    resolve(
                        __dirname,
                        ...(this._options.basePathFragments || []),
                        input
                    )
                )

            case CompilationInputKind.Source:
                this._filesHandler = new FilesHandler({
                    baseDirectory: BaseDirectory.TemporaryFsMount,
                    basePathFragments: ['ts-transformer-testing']
                })

                this._filesHandler.writeSync([{
                    data: input,
                    file: 'index.ts'
                }])

                return this._filesHandler.absolutePaths()

            default:
                assertUnreachable(inputKind)
                return []
        }
    }

    private __tearDown(
        inputKind: CompilationInputKind = this._options.inputKind
    ) {
        switch (inputKind) {
            case CompilationInputKind.FileGlobPattern:
                return

            case CompilationInputKind.Source:
                this._filesHandler?.remove()
                return

            default:
                assertUnreachable(inputKind)
        }
    }

    compile(
        input: CompilationInput,
        options: TransformerTestingCompilerOptions = this._options
    ) {
        const program = ts.createProgram({
            rootNames: this.__setup(input, options.inputKind),
            options,
            host: ts.createCompilerHost(withDefaults(options))
        })

        let compiled = ''

        const writeFileCallback = (
            _: string,
            data: string,
            __: boolean,
            ___?: (_: string) => void,
            ____?: readonly ts.SourceFile[]
        ) => {
            compiled = data
        }

        const emitResult = program.emit(
            undefined,
            writeFileCallback,
            undefined,
            undefined, {
            before: [
                this._transformer(program)
            ]
        })

        logDiagnostics(program, emitResult)

        this.__tearDown(this._options.inputKind)

        return compiled
    }
}
