import { useEffect, useRef, useState } from 'react'
import { useArcadeSound } from './useArcadeSound'
import './PopTheLock.css'

// The dot and marker span 8% and 3.2% of the dial along a 39%-radius orbit.
const HIT_ANGLE = Math.asin((0.04 + 0.016) / 0.39) * 180 / Math.PI
const LOCK_SIZE = 25
const HITS_PER_SPEED = 5
const SPEEDS = [96, 120, 144, 168, 192]

function speedIndex(remaining: number) {
  return Math.min(SPEEDS.length - 1, Math.floor((LOCK_SIZE - remaining) / HITS_PER_SPEED))
}

type Phase = 'ready' | 'playing' | 'early' | 'late' | 'open'

type Round = {
  phase: Phase
  remaining: number
  angle: number
  direction: number
  distance: number
  startedAt: number
}

const initial: Round = {
  phase: 'ready', remaining: LOCK_SIZE, angle: 0,
  direction: 1, distance: 95, startedAt: 0,
}

// Distance along this leg keeps timing continuous even across twelve o'clock.
function traveled(round: Round, now: number) {
  return Math.max(0, now - round.startedAt) * SPEEDS[speedIndex(round.remaining)] / 1000
}

function nextDistance() {
  return 55 + Math.random() * 190
}

export default function PopTheLock() {
  const [round, setRound] = useState(initial)
  const { chime, muted, toggleSound } = useArcadeSound()
  const marker = useRef<HTMLSpanElement>(null)
  const board = useRef<HTMLButtonElement>(null)
  const { phase, remaining } = round
  const targetAngle = round.angle + round.direction * round.distance

  useEffect(() => {
    if (round.phase !== 'playing') return
    let frame: number
    function animate(now: number) {
      const distance = traveled(round, now)
      const angle = round.angle + round.direction * distance
      if (distance > round.distance + HIT_ANGLE) {
        setRound(current => current === round ? { ...round, phase: 'late' } : current)
        return
      }
      if (marker.current) marker.current.style.transform = `rotate(${angle}deg)`
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [round])

  function start() {
    setRound({ ...initial, phase: 'playing',
      startedAt: performance.now(), distance: nextDistance() })
    board.current?.focus({ preventScroll: true })
  }

  function tap() {
    if (phase !== 'playing') {
      start()
      return
    }
    const now = performance.now()
    const distance = traveled(round, now)
    const angle = round.angle + round.direction * distance
    if (distance < round.distance - HIT_ANGLE) {
      setRound({ ...round, phase: 'early', angle, distance: round.distance - distance })
      return
    }
    if (distance > round.distance + HIT_ANGLE) {
      setRound({ ...round, phase: 'late' })
      return
    }

    chime([988, 1568], 0.065)
    if (remaining === 1) {
      setRound({ ...round, phase: 'open', angle, distance: round.distance - distance, remaining: 0 })
    } else {
      setRound({ ...round, angle, remaining: remaining - 1, direction: -round.direction,
        distance: nextDistance(), startedAt: now })
    }
  }

  const displayAngle = phase === 'late' ? targetAngle + round.direction * (HIT_ANGLE + 1) : round.angle
  const action = { ready: 'Start game', playing: 'Restart', early: 'Try again', late: 'Try again', open: 'Play again' }[phase]
  const message = {
    ready: 'Ready to start.',
    playing: `${remaining} ${remaining === 1 ? 'hit' : 'hits'} to unlock.`,
    early: "Too early! The marker hadn't reached the dot.",
    late: 'Missed it! The marker passed the dot.',
    open: `Lock opened! You hit all ${LOCK_SIZE}.`,
  }[phase]

  return (
    <section className="pop-lock" data-phase={phase} aria-labelledby="lock-title">
      <button ref={board} className="lock-board" autoFocus
        aria-label={phase === 'playing' ? 'Tap the lock' : action}
        onPointerDown={event => {
          if (event.isPrimary && event.button === 0) tap()
        }}
        onClick={event => { if (event.detail === 0) tap() }}
        onKeyDown={event => {
          if (event.code === 'Space' || event.key === 'Enter') {
            event.preventDefault()
            if (!event.repeat) tap()
          }
        }}>
        <span className="lock-hardware" aria-hidden="true">
          <span className="lock-shackle" />
          <span className="lock-dial">
            <span className="lock-track" />
            <span className="lock-orbit" style={{ transform: `rotate(${targetAngle}deg)` }}><span className="lock-dot" /></span>
            <span ref={marker} className="lock-orbit" style={{ transform: `rotate(${displayAngle}deg)` }}><span className="lock-marker" /></span>
            <span className="lock-count"><strong>{remaining}</strong><small>{phase === 'open' ? 'Unlocked' : remaining === 1 ? 'Hit left' : 'Hits left'}</small></span>
          </span>
        </span>
      </button>
      <div className="lock-panel">
        <span className="genre">Timing</span>
        <h1 id="lock-title">Pop the Lock</h1>
        <p>Click the dial or press <kbd>Space</kbd> to start. Tap again when the red marker touches the yellow dot.</p>
        <p>Hit all {LOCK_SIZE} dots to open the lock. The marker reverses on each hit and speeds up every {HITS_PER_SPEED} hits. A miss ends the run.</p>
        <div className="lock-level"><span>Speed</span><strong>{speedIndex(remaining) + 1} / {SPEEDS.length}</strong></div>
        <p role="status">{message}</p>
        <button className="lock-action" onClick={start}>{action}</button>
        <button className="lock-sound" aria-pressed={!muted} onClick={() => {
          toggleSound()
          if (phase === 'playing') board.current?.focus()
        }}>Sound {muted ? 'off' : 'on'}</button>
      </div>
    </section>
  )
}
