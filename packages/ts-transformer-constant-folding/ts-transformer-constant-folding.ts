import * as ts from 'typescript'

interface Config {}

const foldBinaryExpression = (node: ts.BinaryExpression) => {
    if (
        ts.isNumericLiteral(node.left) &&
        ts.isNumericLiteral(node.right)
    ) {
        switch (node.operatorToken.kind) {
        case ts.SyntaxKind.PlusToken:
            return ts.factory.createNumericLiteral(
                Number(node.left.getText()) + Number(node.right.getText())
            )
        }
    }

    return node
}

const transformer = (
    _program: ts.Program,
    _config?: Config
): ts.TransformerFactory<ts.SourceFile> => {
    return (context) => {
        return (sourceFile) => {
            const visitor = (node: ts.Node): ts.Node => {
                if (ts.isBinaryExpression(node)) {
                    return foldBinaryExpression(node)
                }

                return ts.visitEachChild(node, visitor, context)
            }

            return ts.visitNode(sourceFile, visitor)
        }
    }
}

export default transformer
