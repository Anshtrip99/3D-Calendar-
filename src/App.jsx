import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { months } from './data/months.js'

const CalendarScene = lazy(() => import('./components/CalendarScene.jsx'))
const DesignerIntro = lazy(() => import('./components/DesignerIntro.jsx'))
const MonthShowcase = lazy(() => import('./components/MonthShowcase.jsx'))
const weatherOptions = [
  { id: 'sunny', number: '13', label: 'Sunny', icon: '☀', image: '/weather-13-sunny.png' },
  { id: 'clear', number: '14', label: 'Clear', icon: '◌', image: '/weather-14-clear.png' },
  { id: 'rainy', number: '15', label: 'Rainy', icon: '☂', image: '/weather-15-rainy.png' },
  { id: 'snowy', number: '16', label: 'Snowy', icon: '❄', image: '/weather-16-snowy.png' },
]

function App() {
  const [month, setMonth] = useState(0)
  const [phase, setPhase] = useState('stack')
  const [spin, setSpin] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [weather, setWeather] = useState(() => {
    const saved = window.localStorage.getItem('everyday-weather')
    return weatherOptions.some(option => option.id === saved) ? saved : 'sunny'
  })
  const [clock, setClock] = useState(() => new Date())
  const current = months[month]
  const currentWeather = weatherOptions.find(option => option.id === weather) || weatherOptions[0]
  const hour = clock.getHours()
  const night = hour < 6 || hour >= 19
  const localTime = clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('everyday-weather', weather)
  }, [weather])
  const changeMonth = useCallback((next) => {
    setMonth((next + 12) % 12)
    setPhase('stack')
    setHasInteracted(true)
  }, [])

  useEffect(() => {
    if (phase !== 'placing') return undefined
    const timer = window.setTimeout(() => {
      setMonth(value => (value + 1) % 12)
      setPhase('stack')
    }, 1320)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    const onKey = event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); changeMonth(month + 1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); changeMonth(month - 1) }
      if (event.key === 'Escape') setPhase('stack')
      if (event.key === 'Enter' && phase === 'pulled') setPhase('placing')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [changeMonth, month, phase])

  const chooseMonth = index => { changeMonth(index); setHasInteracted(true) }

  return <main className={`experience ${night ? 'theme-night' : 'theme-day'}`} data-weather={weather} data-theme={night ? 'night' : 'day'}>
    <section className="stage" aria-label="Interactive 2027 desk calendar">
      <div className="ambient-orbit" aria-hidden="true" />
      <Suspense fallback={<div className="scene-loading" role="status">Preparing your calendar…</div>}>
        <CalendarScene month={month} phase={phase} setPhase={value => { setPhase(value); setHasInteracted(true) }} setMonth={chooseMonth} spin={spin} weatherImage={currentWeather.image} />
      </Suspense>

      <header className="masthead">
        <a className="brand" href="#home" aria-label="Everyday, home">EVERYDAY<span>STUDIO</span></a>
        <div className="edition-tag"><span className="status-dot" /> A DESK CALENDAR FOR 2027</div>
        <button className="quiet-link turn-button" onClick={() => setSpin(value => value + 1)} aria-label="Rotate the calendar through 360 degrees">TURN 360° <span>↻</span></button>
      </header>

      <div className="intro-lockup" id="home">
        <div className="eyebrow"><span>01 — 12</span> / A YEAR, CONSIDERED</div>
        <h1>Make room<br />for <em>every day.</em></h1>
        <p>A little space to plan, pause, and make the most of what comes next.</p>
      </div>

      <aside className="weather-picker" aria-label="Choose the weather background">
        <div className="weather-picker-heading"><span>WEATHER SCENE</span><small>AUTO THEME · {night ? 'NIGHT' : 'DAY'} · {localTime}</small></div>
        <div className="weather-options" role="group" aria-label="Weather background">
          {weatherOptions.map(option => <button key={option.id} className={`weather-option ${weather === option.id ? 'active' : ''}`} onClick={() => setWeather(option.id)} aria-pressed={weather === option.id} aria-label={`${option.number} ${option.label}`}>
            <span className="weather-icon" aria-hidden="true">{option.icon}</span>
            <span className="weather-option-copy"><strong>{option.number}</strong><small>{option.label}</small></span>
          </button>)}
        </div>
      </aside>

      <aside className="month-lockup" aria-live="polite">
        <span className="month-number">{String(month + 1).padStart(2, '0')}<i>.</i></span>
        <span className="month-title">{current.name}<small>JANUARY — DECEMBER 2027</small></span>
        <span className="month-note">{current.scene}</span>
      </aside>

      <div className={`interaction-hint ${hasInteracted || phase !== 'stack' ? 'is-hidden' : ''}`}>
        <span className="hint-line" />
        <span>Pull a card forward</span>
        <span className="hint-arrow">↗</span>
      </div>

      <div className={`place-prompt ${phase === 'pulled' ? 'is-visible' : ''}`}>
        <span className="place-copy"><i /> MONTH {String(month + 1).padStart(2, '0')} IN HAND</span>
        <button className="place-button" onClick={() => setPhase('placing')}>
          Place behind the stack <span>↙</span>
        </button>
        <button className="return-button" onClick={() => setPhase('stack')}>Return <span>×</span></button>
      </div>

      <div className="bottom-dock">
        <div className="dock-month"><span>NOW TURNING</span><strong>{current.name}<small>2027</small></strong></div>
        <div className="month-selector" role="group" aria-label="Choose a month">
          {months.map((item, index) => <button key={item.name} className={index === month ? 'active' : ''} aria-label={`Show ${item.name} 2027`} aria-pressed={index === month} onClick={() => chooseMonth(index)}><span>{String(index + 1).padStart(2, '0')}</span></button>)}
        </div>
        <div className="dock-actions">
          {phase === 'stack' && <button className="pull-cta" onClick={() => { setPhase('pulled'); setHasInteracted(true) }}>Pull this card <span>↗</span></button>}
          {phase === 'placing' && <span className="placing-label">SLIDING INTO PLACE</span>}
          <div className="stepper"><button onClick={() => changeMonth(month - 1)} aria-label="Previous month">←</button><button onClick={() => changeMonth(month + 1)} aria-label="Next month">→</button></div>
        </div>
      </div>

      <div className="stage-index">EVERYDAY OBJECTS <span>—</span> 001</div>
      <div className="stage-scroll">DRAG OUTSIDE THE CARD TO ORBIT <span>↻</span></div>
    </section>

    <Suspense fallback={<div className="showcase-loading" aria-label="Loading month designs" />}><MonthShowcase month={month} onChange={chooseMonth} /></Suspense>

    <section className="story" id="story">
      <div className="story-top"><span className="eyebrow">MEET THE MAKERS</span><span className="story-index">THE EVERYDAY CALENDAR / 2027</span></div>
      <Suspense fallback={<div className="designer-loading" aria-label="Loading the studio scene" />}><DesignerIntro /></Suspense>
      <div className="spec-grid">
        <div><span>01</span><strong>12 illustrated cards</strong><small>A new little world every month</small></div>
        <div><span>02</span><strong>Floating card box</strong><small>Twelve cards, held in a clean frame</small></div>
        <div><span>03</span><strong>Thoughtful details</strong><small>Dates and Indian observances</small></div>
        <div><span>04</span><strong>Made to keep</strong><small>Designed for desks and everyday moments</small></div>
      </div>
      <footer><a className="brand" href="#home">EVERYDAY<span>STUDIO</span></a><span>MAKE THE MOST OF TODAY.</span><a href="#home">BACK TO TOP ↑</a></footer>
    </section>
  </main>
}

export default App
