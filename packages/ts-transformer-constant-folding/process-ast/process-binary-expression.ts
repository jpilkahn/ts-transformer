import * as ts from 'typescript'

import { isOperand, isOperatorToken, operation } from '../binary-op'

import type { OperandOrNode } from './process-ast-common'

export function processBinaryExpression(
    node: ts.BinaryExpression,
    typeChecker: ts.TypeChecker
) {
    if (!isOperatorToken(node.operatorToken.kind)) {
        return node
    }

    const lhs = processOperand(node.left, typeChecker)
    const rhs = processOperand(node.right, typeChecker)

    if (isOperand(lhs) && isOperand(rhs)) {
        return operation(
            node.operatorToken.kind,
            lhs,
            rhs
        )
    }

    return node
}

export function processOperand(
    node: ts.Node,
    typeChecker: ts.TypeChecker
): OperandOrNode {
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
