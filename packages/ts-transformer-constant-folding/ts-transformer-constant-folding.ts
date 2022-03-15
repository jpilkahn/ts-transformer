import * as ts from 'typescript'

import { isFoldableOperatorToken, operation } from './binary-op'

type NumberOrNode = number | ts.Node

function isFoldableOperand(value: unknown): value is number {
    return typeof value === 'number'
}

function processOperand(
    node: ts.Node,
    typeChecker: ts.TypeChecker
): NumberOrNode {
    if (ts.isBinaryExpression(node)) {
        return processBinaryExpression(node, typeChecker)
    }

    if (ts.isParenthesizedExpression(node)) {
        return processOperand(node.expression, typeChecker)
    }

    const typeInfo = typeChecker.getTypeAtLocation(node)

    if (typeInfo.isNumberLiteral()) {
        return typeInfo.value
    }

    return node
}

const processBinaryExpression = (
    node: ts.BinaryExpression,
    typeChecker: ts.TypeChecker
) => {
    if (!isFoldableOperatorToken(node.operatorToken.kind)) {
        return node
    }

    const lhs = processOperand(node.left, typeChecker)
    const rhs = processOperand(node.right, typeChecker)

    if (
        isFoldableOperand(lhs)
        && isFoldableOperand(rhs)
    ) {
        return operation(
            node.operatorToken.kind,
            lhs,
            rhs
        )
    }

    return node
}

function numericLiteralOrNode(value: NumberOrNode) {
    return (
        isFoldableOperand(value)
            ? ts.factory.createNumericLiteral(value)
            : value
    )
}

const transformer = (
    program: ts.Program
): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker()

    return (context) => (sourceFile) => {
        const visitor = (node: ts.Node): ts.Node => {
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
