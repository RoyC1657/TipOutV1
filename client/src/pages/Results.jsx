import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Results() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [results, setResults] = useState(null)
    const [summary, setSummary] = useState(null)

    useEffect(() => {
        // Fetch both calculation and the shift summary
        axios.get(`${import.meta.env.VITE_API_URL}/shifts/${id}/calculate`)
            .then(response => setResults(response.data))
        axios.get(`${import.meta.env.VITE_API_URL}/shifts/${id}/summary`)
            .then(response => setSummary(response.data))
    }, [id])

    if (!results || !summary) 
        return <div>Loading...</div>
   // returns loading screen until both results and summary are fetched

 return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Tipout Results</h1>
          <p className="text-text-muted mt-1">Shift date: {summary.date}</p>
        </div>
        <button
          onClick={() => navigate('/create-shift')}
          className="bg-surface border border-border text-text px-4 py-2 rounded-lg hover:border-primary transition"
        >
          New Shift
        </button>
      </div>

      {/* Shift Summary */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-text mb-4">Shift Summary</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-background rounded-lg p-4">
            <p className="text-text-muted text-sm">Total Cash</p>
            <p className="text-text text-xl font-bold">${summary.totalCash.toFixed(2)}</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-text-muted text-sm">Total Credit</p>
            <p className="text-text text-xl font-bold">${summary.totalCredit.toFixed(2)}</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-text-muted text-sm">Server Hours</p>
            <p className="text-text text-xl font-bold">{summary.serverHours}h</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-text-muted text-sm">Support Hours</p>
            <p className="text-text text-xl font-bold">{summary.supportHours}h</p>
          </div>
        </div>
      </div>

      {/* Cash and Credit Results */}
      {results.map(pool => (
        <div key={pool.type} className="bg-surface rounded-xl border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text capitalize">{pool.type} Tips</h2>
            <span className="text-text-muted text-sm">
              Total: ${pool.total.toFixed(2)} — Rate: ${pool.serverRate.toFixed(2)}/hr (server) · ${pool.supportRate.toFixed(2)}/hr (support)
            </span>
          </div>
          <ul>
            {pool.payouts.map((person, index) => (
              <li key={index} className="flex items-center justify-between px-6 py-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-text">{person.name}</p>
                  <p className="text-sm text-text-muted capitalize">{person.role_worked} · {person.hours}h</p>
                </div>
                <p className="text-xl font-bold text-text">${person.payout.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  )
}

