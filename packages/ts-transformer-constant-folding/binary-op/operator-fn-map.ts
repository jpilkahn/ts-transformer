import { SyntaxKind } from 'typescript'

export type Operand = number

export type BinaryOp<T> = (lhs: T, rhs: T) => T

const makeOperatorFnMap = <
    TMap extends Record<
        number,
        BinaryOp<Operand>
    >
>(map: TMap) => map

export const operatorFnMap = makeOperatorFnMap({
    [SyntaxKind.AsteriskToken]: (lhs, rhs) => lhs * rhs,
    [SyntaxKind.AsteriskAsteriskToken]: (lhs, rhs) => lhs ** rhs,
    [SyntaxKind.MinusToken]: (lhs, rhs) => lhs - rhs,
    [SyntaxKind.PlusToken]: (lhs, rhs) => lhs + rhs,
    [SyntaxKind.SlashToken]: (lhs, rhs) => lhs / rhs
})
