import { useState } from 'react'
import { games } from './games'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const path = window.location.pathname.replace(/\/+$/, '')
  const game = games.find(({ slug }) => path === '/games/' + slug)
  const term = query.toLowerCase().trim()
  const matches = games.filter(({ name, genre, description }) =>
    [name, genre, description].some((field) => field.toLowerCase().includes(term)),
  )

  if (path) {
    return (
      <main className="shell detail">
        <a className="back" href="/">&larr; Back to arcade</a>
        {game ? <game.Game /> : <h1>Machine not found</h1>}
      </main>
    )
  }

  return (
    <main className="shell">
      <header className="marquee">
        <h1>Personal <span>Arcade</span></h1>
        <img src="/arcade/moon.png" className="moon" alt="" />
      </header>
      <div className="search">
        <span className="magnifier" aria-hidden="true" />
        <input aria-label="Search games" type="search" placeholder="Search games…" value={query}
          onChange={(event) => setQuery(event.target.value)} />
      </div>
      <section aria-labelledby="library">
        <div className="library-heading">
          <h2 id="library"><span className="grid-icon" aria-hidden="true" />Game library</h2>
          <span className="rule" />
          <span role="status">{matches.length} {matches.length === 1 ? 'game' : 'games'}</span>
        </div>
        <div className="game-grid">
          {matches.map((item) => (
            <a className="card" data-game={item.slug} key={item.slug} href={`/games/${item.slug}`} aria-label={`Open ${item.name}`}>
              <img className="scene" src={`/arcade/${item.slug}.png`} width="200" height="84" alt="" />
              <div className="card-copy">
                <span className="genre">{item.genre}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="arrow" aria-hidden="true">↗</span>
              </div>
            </a>
          ))}
        </div>
        {matches.length === 0 && <div className="empty"><h3>No matching games</h3><button onClick={() => setQuery('')}>Clear search</button></div>}
      </section>
    </main>
  )
}

export default App
