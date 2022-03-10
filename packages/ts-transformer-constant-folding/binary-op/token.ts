import type { SyntaxKind } from 'typescript'

import { operatorFnMap } from './operator-fn-map'

export type FoldableOperatorToken = keyof typeof operatorFnMap

export function isFoldableOperatorToken(
    token: SyntaxKind
): token is FoldableOperatorToken {
    return Object.keys(operatorFnMap).includes(token.toString())
}
