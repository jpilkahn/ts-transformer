import * as ts from 'typescript'

import { isOperand } from '../binary-op'

import type { OperandOrNode } from './process-ast-common'

export function numericLiteralOrNode(value: OperandOrNode) {
    if (isOperand(value)) {
        return ts.factory.createNumericLiteral(value)
    }

    return value
}
