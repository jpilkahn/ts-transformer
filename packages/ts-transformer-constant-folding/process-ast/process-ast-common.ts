import type * as ts from 'typescript'

import type { Operand } from '../binary-op'

export type OperandOrNode = Operand | ts.Node
