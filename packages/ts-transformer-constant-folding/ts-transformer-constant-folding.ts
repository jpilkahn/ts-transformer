import * as ts from 'typescript'

import { isNotNullish } from '@jpilkahn/ts-util'

import { isFoldableOperatorToken, operation } from './binary-op'

function getLiteralValue(
    node: ts.Node,
    typeChecker: ts.TypeChecker
) {
    const typeInfo = typeChecker.getTypeAtLocation(node)

    if (typeInfo.isNumberLiteral()) {
        return typeInfo.value
    }

    return undefined
}

const foldBinaryExpression = (
    node: ts.BinaryExpression,
    typeChecker: ts.TypeChecker
) => {
    const lhs = getLiteralValue(node.left, typeChecker)
    const rhs = getLiteralValue(node.right, typeChecker)

    if (
        isNotNullish(lhs)
        && isNotNullish(rhs)
        && isFoldableOperatorToken(node.operatorToken.kind)
    ) {
        return ts.factory.createNumericLiteral(
            operation(
                node.operatorToken.kind,
                lhs,
                rhs
            )
        )
    }

    return node
}

const transformer = (
    program: ts.Program
): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker()

    return (context) => (sourceFile) => {
        const visitor = (node: ts.Node): ts.Node => {
            if (ts.isBinaryExpression(node)) {
                return foldBinaryExpression(node, typeChecker)
            }

            return ts.visitEachChild(node, visitor, context)
        }

        return ts.visitNode(sourceFile, visitor)
    }
}

export default transformer
