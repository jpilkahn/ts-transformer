export type Operand = number

export type BinaryOp<
    Lhs = Operand,
    Rhs = Lhs,
    R = Lhs
> = (lhs: Lhs, rhs: Rhs) => R

export function isOperand(value: unknown): value is Operand {
    return typeof value === 'number'
}
