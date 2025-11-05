import { useState } from 'react'
import WeatherModule from './components/WeatherModule.jsx'
import CurrencyConverter from './components/CurrencyConverter.jsx'
import QuoteGenerator from './components/QuoteGenerator.jsx'

const TABS = ['Weather', 'Converter', 'Quotes']

export default function App() {
  const [activeTab, setActiveTab] = useState('Weather')

  return (
    <div className="container">
      <div className="app-card">
        <h1 style={{marginTop: 0}}>InfoHub</h1>
        <p className="muted" style={{marginTop: 0}}>
          A tiny full‑stack SPA: Weather • Currency • Quotes
        </p>
        <div className="tabs" role="tablist" aria-label="InfoHub modules">
          {TABS.map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={activeTab === t}
              className={`tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="section">
          {activeTab === 'Weather' && <WeatherModule />}
          {activeTab === 'Converter' && <CurrencyConverter />}
          {activeTab === 'Quotes' && <QuoteGenerator />}
        </div>
      </div>
    </div>
  )
}
