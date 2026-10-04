import { useState } from 'react'
import { months } from '../data/months.js'

const weatherForMonth = index => {
  if (index === 0 || index === 10 || index === 11) return { image: '/weather-16-snowy.png', name: 'snow' }
  if (index === 1 || index === 2) return { image: '/weather-13-sunny.png', name: 'spring' }
  if (index >= 3 && index <= 5) return { image: '/weather-14-clear.png', name: 'summer' }
  if (index >= 6 && index <= 8) return { image: '/weather-15-rainy.png', name: 'rain' }
  return { image: '/weather-14-clear.png', name: 'autumn' }
}

export default function MonthShowcase({ month, onChange }) {
  const current = months[month]
  const weather = weatherForMonth(month)
  const december = month === 11
  const diwali = month === 9
  const [direction, setDirection] = useState('next')
  const select = index => {
    const forward = (index - month + 12) % 12
    setDirection(forward <= 6 ? 'next' : 'previous')
    onChange(index)
  }
  const move = amount => {
    setDirection(amount > 0 ? 'next' : 'previous')
    onChange((month + amount + 12) % 12)
  }
  const previous = (month + 11) % 12
  const next = (month + 1) % 12

  return <section className={`month-showcase ${weather.name} ${diwali ? 'festival-diwali' : ''} ${december ? 'festival-christmas' : ''}`} aria-label="Explore the twelve calendar card designs" data-direction={direction}>
    <div className="showcase-weather" key={month} style={{ backgroundImage: `url(${weather.image})` }} aria-hidden="true" />
    {diwali && <div className="fireworks" aria-hidden="true">{[0,1,2,3,4,5].map(i => <i key={i} style={{ '--i': i }} />)}</div>}
    {december && <div className="christmas-scene" aria-hidden="true"><div className="christmas-tree"><i /><i /><i /><b>✦</b></div><div className="santa"><i /><b /><em /><span /></div><div className="snowfall">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--left': `${i * 5.8}%` }} />)}</div></div>}
    <div className="showcase-heading"><span className="eyebrow">THE YEAR, IN COLOUR <i>—</i> {String(month + 1).padStart(2, '0')} / 12</span><h2>{current.name}<span>2027</span></h2><p>One card. One little world. A fresh design for every month.</p></div>
    <div className="showcase-stage">
      <div className="showcase-glow" aria-hidden="true" />
      <button className="showcase-arrow previous" onClick={() => move(-1)} aria-label="Previous month">←</button>
      <button className="showcase-card side-card side-previous" onClick={() => select(previous)} aria-label={`Show ${months[previous].name}`}><img src={`/months/month-${String(previous + 1).padStart(2, '0')}.png`} alt="" /></button>
      <div className="showcase-card main-card" key={month}>
        <img src={`/months/month-${String(month + 1).padStart(2, '0')}.png`} alt={`${current.name} 2027 calendar card design`} />
      </div>
      <button className="showcase-card side-card side-next" onClick={() => select(next)} aria-label={`Show ${months[next].name}`}><img src={`/months/month-${String(next + 1).padStart(2, '0')}.png`} alt="" /></button>
      <button className="showcase-arrow next" onClick={() => move(1)} aria-label="Next month">→</button>
    </div>
    <div className="showcase-footer"><span>12 ORIGINAL ILLUSTRATIONS</span><div className="showcase-dots" role="group" aria-label="Choose a month">{months.map((item, index) => <button key={item.name} className={index === month ? 'active' : ''} aria-label={`Show ${item.name}`} aria-pressed={index === month} onClick={() => select(index)} />)}</div><span>DRAG THROUGH THE YEAR</span></div>
  </section>
}
