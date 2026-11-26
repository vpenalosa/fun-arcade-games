import PopTheLock from './PopTheLock'
import Stacker from './Stacker'

export const games = [
  { slug: 'stacker', name: 'Stacker', genre: 'Timing', description: 'Stop the moving blocks and build a tower twelve rows high.', Game: Stacker },
  { slug: 'pop-the-lock', name: 'Pop the Lock', genre: 'Timing', description: 'Catch 25 dots to open the lock. The marker speeds up every 5 hits.', Game: PopTheLock },
]
