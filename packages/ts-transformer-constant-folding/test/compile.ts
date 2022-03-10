import { sync as globSync } from 'glob'
import * as ts from 'typescript'

export type ProgramTransformer = (
    program: ts.Program
) => ts.TransformerFactory<ts.SourceFile>

const defaultCompilerOptions: Partial<ts.CompilerOptions> = {
    module: ts.ModuleKind.ES2015,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    stripInternal: true,
    target: ts.ScriptTarget.ES2015
}

function withDefaults(options: Partial<ts.CompilerOptions>) {
    return Object.assign({}, defaultCompilerOptions, options)
}

function logDiagnostics(
    program: ts.Program,
    emitResult: ts.EmitResult
) {
    ts.getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics)
        .forEach((diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                '\n'
            )

            const { line, character } = (
                diagnostic.start && diagnostic.file
                ? diagnostic.file.getLineAndCharacterOfPosition(
                    diagnostic.start
                ) : { line: -1, character: -1 }
            )

            const fileName = diagnostic?.file?.fileName || 'unknown file'

            console.log(
                `${fileName}:${line + 1}:${character + 1}`,
                message
            )
    })
}

export function compiler(
    transformer: ProgramTransformer
) {
    return function compile(
        inputFilesGlobPattern: string,
        options: ts.CompilerOptions = defaultCompilerOptions
    ) {
        const program = ts.createProgram({
            rootNames: globSync(inputFilesGlobPattern),
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

        const emitResult = program.emit(undefined, writeFileCallback, undefined, undefined, {
            before: [
                transformer(program)
            ]
        })

        logDiagnostics(program, emitResult)

        return compiled
    }
}
