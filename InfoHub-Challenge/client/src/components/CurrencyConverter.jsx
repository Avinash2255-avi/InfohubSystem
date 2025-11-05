import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100)
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRates = async () => {
    try {
      setIsLoading(true)
      setError('')
      const res = await axios.get('/api/currency', { params: { amount } })
      setData(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load rates.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    
  }, [])

  return (
    <div>
      <h2 style={{marginTop:0}}>Currency Converter (INR → USD/EUR)</h2>
      <div className="row">
        <input
          className="input"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in INR"
        />
        <button className="button" onClick={fetchRates}>Convert</button>
      </div>

      {isLoading && <p className="muted">Loading...</p>}
      {error && <div className="error">{error}</div>}
      {(!isLoading && !error && data) && (
        <div className="card" aria-live="polite">
          <p style={{margin:0}}>INR <strong>{data.amountInINR}</strong></p>
          <p style={{margin:'8px 0'}}>USD ≈ <strong>{data.usd}</strong></p>
          <p style={{margin:0}}>EUR ≈ <strong>{data.eur}</strong></p>
        </div>
      )}
    </div>
  )
}
