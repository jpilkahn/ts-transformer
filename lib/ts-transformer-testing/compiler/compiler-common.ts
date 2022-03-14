import type * as ts from 'typescript'

export type ProgramTransformer = (
    program: ts.Program
) => ts.TransformerFactory<ts.SourceFile>

export type CompilationInput = string

export enum CompilationInputKind {
    FileGlobPattern,
    Source
}
