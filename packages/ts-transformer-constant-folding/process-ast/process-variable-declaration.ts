import * as ts from 'typescript'

import { isOperand } from '../binary-op'

import { processOperand } from './process-binary-expression'

export function processVariableDeclaration(
    node: ts.VariableDeclaration & { original?: ts.VariableDeclaration },
    typeChecker: ts.TypeChecker
) {
    const initializer = node.initializer ?? node?.original?.initializer

    if (!initializer) return node

    const processed = processOperand(initializer, typeChecker)

    if (isOperand(processed) && ts.isIdentifier(node.name)) {
        return ts.factory.createVariableDeclaration(
            ts.factory.createIdentifier(node.name.getText()),
            node.exclamationToken,
            undefined,
            ts.factory.createNumericLiteral(processed)
        )
    }

    return node
}
