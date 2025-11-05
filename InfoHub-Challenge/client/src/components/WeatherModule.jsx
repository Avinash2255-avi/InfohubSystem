import { useEffect, useState } from 'react'
import axios from 'axios'

export default function WeatherModule() {
  const [city, setCity] = useState('Mumbai,IN')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async () => {
    try {
      setIsLoading(true)
      setError('')
      const res = await axios.get(`/api/weather`, { params: { city } })
      setData(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load weather.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h2 style={{marginTop:0}}>Weather</h2>
      <div className="row">
        <input
          className="input"
          placeholder="City (e.g., Mumbai,IN or London,UK)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="button" onClick={fetchWeather}>Refresh</button>
      </div>

      {isLoading && <p className="muted">Loading...</p>}
      {error && <div className="error">{error}</div>}
      {(!isLoading && !error && data) && (
        <div className="card" aria-live="polite">
          <p style={{margin:0}}><strong>{data.city}</strong></p>
          <p style={{margin:'8px 0'}}>Temp: {data.temperature}°C (feels {data.feelsLike}°C)</p>
          <p className="muted" style={{margin:0}}>Condition: {data.condition} • Humidity: {data.humidity}%</p>
        </div>
      )}
    </div>
  )
}
