import { SyntaxKind } from 'typescript'

import type { BinaryOp } from './binary-op-fn'

const makeOperatorFnMap = <
    TMap extends Record<
        number,
        BinaryOp
    >
>(map: TMap) => map

export const operatorFnMap = makeOperatorFnMap({
    [SyntaxKind.AsteriskToken]: (lhs, rhs) => lhs * rhs,
    [SyntaxKind.AsteriskAsteriskToken]: (lhs, rhs) => lhs ** rhs,
    [SyntaxKind.MinusToken]: (lhs, rhs) => lhs - rhs,
    [SyntaxKind.PlusToken]: (lhs, rhs) => lhs + rhs,
    [SyntaxKind.SlashToken]: (lhs, rhs) => lhs / rhs
})
