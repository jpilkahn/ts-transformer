import * as ts from 'typescript'

interface Config {}

const invalidValues = new Set<unknown>([undefined, null, NaN])

function isValidValue<T>(value: T) {
    return !invalidValues.has(value)
}

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

    if (isValidValue(lhs) && isValidValue(rhs)) {
        switch (node.operatorToken.kind) {
        case ts.SyntaxKind.PlusToken:
            return ts.factory.createNumericLiteral(
                lhs + rhs
            )
        }
    }

    return node
}

const transformer = (
    program: ts.Program,
    _config?: Config
): ts.TransformerFactory<ts.SourceFile> => {
    const typeChecker = program.getTypeChecker()

    return (context) => {
        return (sourceFile) => {
            const visitor = (node: ts.Node): ts.Node => {
                if (ts.isBinaryExpression(node)) {
                    return foldBinaryExpression(node, typeChecker)
                }

                return ts.visitEachChild(node, visitor, context)
            }

            return ts.visitNode(sourceFile, visitor)
        }
    }
}

export default transformer
