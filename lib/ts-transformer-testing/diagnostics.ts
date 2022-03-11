import * as ts from 'typescript'

export function logDiagnostics(
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
