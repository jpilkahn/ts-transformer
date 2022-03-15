import type { SyntaxKind } from 'typescript'

import { operatorFnMap } from './operator-fn-map'

export type OperatorToken = keyof typeof operatorFnMap

export function isOperatorToken(
    token: SyntaxKind
): token is OperatorToken {
    return Object.keys(operatorFnMap).includes(
        token.toString()
    )
}
