import * as ts from 'typescript'

import {
    numericLiteralOrNode,
    processBinaryExpression,
    processOperand,
    processVariableDeclaration
} from './process-ast'

export const transformer = (
    program: ts.Program
): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker()

    return (context) => (sourceFile) => {
        const visitor = (node: ts.Node): ts.Node => {
            if (ts.isVariableDeclaration(node)) {
                return processVariableDeclaration(node, typeChecker)
            }

            if (ts.isBinaryExpression(node)) {
                return numericLiteralOrNode(
                    processBinaryExpression(node, typeChecker)
                )
            }

            if (ts.isParenthesizedExpression(node)) {
                return numericLiteralOrNode(
                    processOperand(node.expression, typeChecker)
                )
            }

            return ts.visitEachChild(node, visitor, context)
        }

        return ts.visitNode(sourceFile, visitor)
    }
}

export default transformer
