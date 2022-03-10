import type { Operand } from './operator-fn-map'
import type { FoldableOperatorToken } from './token'

import { operatorFnMap } from './operator-fn-map'

export function operation<T extends Operand>(
    token: FoldableOperatorToken,
    lhs: T,
    rhs: T
) {
    return operatorFnMap[token](lhs, rhs)
}
