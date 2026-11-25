import { useEffect, useRef, useState } from 'react'

export function useArcadeSound() {
  const [muted, setMuted] = useState(false)
  const audio = useRef<AudioContext | null>(null)

  function silence() {
    if (audio.current) void audio.current.close().catch(() => {})
    audio.current = null
  }

  useEffect(() => {
    window.addEventListener('pagehide', silence)
    return () => {
      window.removeEventListener('pagehide', silence)
      silence()
    }
  }, [])

  function chime(notes: number[], noteLength = 0.09) {
    if (muted || !window.AudioContext) return
    const ctx = audio.current ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
    notes.forEach((frequency, i) => {
      const time = ctx.currentTime + i * noteLength
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'square'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.001, time)
      gain.gain.linearRampToValueAtTime(0.035, time + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.001, time + noteLength - 0.005)
      oscillator.connect(gain).connect(ctx.destination)
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
      oscillator.start(time)
      oscillator.stop(time + noteLength)
    })
  }

  function toggleSound() {
    if (!muted) silence()
    setMuted(!muted)
  }

  return { chime, muted, toggleSound }
}
