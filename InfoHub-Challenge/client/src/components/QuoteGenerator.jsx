import { useEffect, useState } from 'react'
import axios from 'axios'

export default function QuoteGenerator() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchQuote = async () => {
    try {
      setIsLoading(true)
      setError('')
      const res = await axios.get('/api/quote')
      setData(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load quote.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div>
      <h2 style={{marginTop:0}}>Motivational Quote</h2>
      {isLoading && <p className="muted">Loading...</p>}
      {error && <div className="error">{error}</div>}
      {(!isLoading && !error && data) && (
        <div className="card" aria-live="polite">
          <p style={{margin:0, fontSize:18}}>"{data.quote}"</p>
          <p className="muted" style={{marginTop:8}}>Source: {data.source}</p>
          <button className="button" onClick={fetchQuote}>New Quote</button>
        </div>
      )}
    </div>
  )
}
