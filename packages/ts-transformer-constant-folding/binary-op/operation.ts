import type { Operand } from './binary-op-fn'
import type { OperatorToken } from './operator-token'

import { operatorFnMap } from './operator-fn-map'

export function operation<T extends Operand>(
    token: OperatorToken,
    lhs: T,
    rhs: T
) {
    return operatorFnMap[token](lhs, rhs)
}
