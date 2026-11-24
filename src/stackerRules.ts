export const HEIGHT = 12
export const COLUMNS = 7

export type Block = { left: number; width: number }
export type Round = {
  phase: 'ready' | 'playing' | 'lost' | 'won'
  rows: Block[]
  moving: Block
  direction: number
}

export function freshRound(phase: 'ready' | 'playing' = 'ready'): Round {
  return { phase, rows: [], moving: { left: 0, width: 3 }, direction: 1 }
}

export function advance(round: Round): Round {
  if (round.phase !== 'playing') return round
  const { left, width } = round.moving
  const direction = left === 0 ? 1 : left + width === COLUMNS ? -1 : round.direction
  return { ...round, direction, moving: { left: left + direction, width } }
}

export function place(round: Round): Round {
  if (round.phase !== 'playing') return round
  const base = round.rows.at(-1)
  const { left, width } = round.moving
  const start = base ? Math.max(left, base.left) : left
  const end = base ? Math.min(left + width, base.left + base.width) : left + width
  if (start >= end) return { ...round, phase: 'lost' }
  const rows = [...round.rows, { left: start, width: end - start }]
  if (rows.length === HEIGHT) return { ...round, rows, phase: 'won' }
  const limit = rows.length >= 8 ? 1 : rows.length >= 4 ? 2 : 3
  const nextWidth = Math.min(limit, end - start)
  const direction = rows.length % 2 === 0 ? 1 : -1
  return { phase: 'playing', rows, direction, moving: { left: direction === 1 ? 0 : COLUMNS - nextWidth, width: nextWidth } }
}
