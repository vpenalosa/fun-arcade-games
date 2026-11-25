import { useEffect, useRef, useState } from 'react'
import { advance, COLUMNS, freshRound, HEIGHT, place } from './stackerRules'
import { useArcadeSound } from './useArcadeSound'
import './Stacker.css'

export default function Stacker() {
  const [round, setRound] = useState(() => freshRound())
  const { chime, muted, toggleSound } = useArcadeSound()
  const [message, setMessage] = useState('Stack all 12 rows to win.')
  const board = useRef<HTMLButtonElement>(null)
  const { phase, moving, rows } = round
  const height = rows.length

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = window.setInterval(() => setRound(advance), 440 - height * 26)
    return () => window.clearInterval(timer)
  }, [phase, rows, height])

  function start() {
    setRound(freshRound('playing'))
    setMessage('Place the first row anywhere.')
    chime([262, 392])
    board.current?.focus()
  }

  function lock() {
    if (phase !== 'playing') return
    const next = place(round)
    setRound(next)
    if (next.phase === 'lost') {
      setMessage('No overlap. Round over.')
      chime([247, 165, 98])
    } else if (next.phase === 'won') {
      setMessage('Tower complete. You win!')
      chime([392, 494, 587, 784])
    } else {
      const retained = next.rows[next.rows.length - 1].width
      const trimmed = retained < moving.width
      const checkpoint = next.rows.length === 4 || next.rows.length === 8
      const feedback = trimmed ? `Trimmed to ${retained} wide.` : 'Row locked.'
      setMessage(checkpoint ? `${feedback} Checkpoint: next block is ${next.moving.width} wide.` : feedback)
      chime(checkpoint ? [440, 554, 659] : trimmed ? [330, 220] : [330 + height * 32])
    }
  }

  return (
    <section className="stacker" aria-labelledby="stacker-title">
      <button className="stacker-board" ref={board} aria-label="Stacker board. Click or press Space to place a block"
        tabIndex={phase === 'playing' ? 0 : -1} aria-disabled={phase !== 'playing'}
        onClick={lock} onKeyDown={(event) => {
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault()
            if (!event.repeat) lock()
          }
        }}>
        {Array.from({ length: HEIGHT * COLUMNS }, (_, cell) => {
          const row = HEIGHT - 1 - Math.floor(cell / COLUMNS)
          const column = cell % COLUMNS
          const active = row === height && phase !== 'won'
          const block = active ? moving : rows[row]
          const filled = block && column >= block.left && column < block.left + block.width
          const color = filled ? active ? phase === 'lost' ? 'miss' : 'moving' : 'locked' : ''
          return <span key={cell} className={`tile ${color}`} aria-hidden="true" />
        })}
      </button>
      <div className="stacker-panel">
        <span className="genre">Timing</span>
        <h1 id="stacker-title">Stacker</h1>
        <p>Click the board or press <kbd>Space</kbd> with the board focused to lock the moving block. Only squares supported by the row below stay.</p>
        <p>The block speeds up and narrows to at most two squares on row 5 and one on row 9. A complete miss ends the round.</p>
        <div className="stacker-height">Height <strong>{height} / {HEIGHT}</strong></div>
        <p role="status" className="stacker-status">{message}</p>
        <div className="stacker-actions">
          <button onClick={start}>{phase === 'ready' ? 'Start game' : 'Restart'}</button>
          <button aria-pressed={!muted} onClick={() => {
            toggleSound()
            if (phase === 'playing') board.current?.focus()
          }}>Sound {muted ? 'off' : 'on'}</button>
        </div>
      </div>
    </section>
  )
}
