import { useState } from 'react'
import axios from 'axios'

const BILLS = [100, 50, 20, 10, 5, 1]

export default function DenominationCalculator({ results, shiftId }) {
  const [availableBills, setAvailableBills] = useState({
    100: '', 50: '', 20: '', 10: '', 5: '', 1: ''
  })
  const [breakdown, setBreakdown] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleBillChange(bill, count) {
    setAvailableBills({ ...availableBills, [bill]: count })
  }

  async function handleCalculate() {
    setLoading(true)

    // convert bill counts to numbers, default to 0 if empty
    const bills = {}
    BILLS.forEach(bill => {
      bills[bill] = parseInt(availableBills[bill]) || 0
    })

    // get cash payouts only from results
    const cashPayouts = results.find(r => r.type === 'cash').payouts

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/shifts/${shiftId}/denominations`,
      { availableBills: bills, payouts: cashPayouts }
    )

    setBreakdown(response.data)
    setLoading(false)
  }

  return (
    <div className="bg-surface rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-text">Cash Denomination Breakdown</h2>
        <p className="text-text-muted text-sm mt-1">Enter how many of each bill you have in the drawer</p>
      </div>

      {/* Bill Inputs */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {BILLS.map(bill => (
            <div key={bill}>
              <label className="block text-sm text-text-muted mb-1">${bill} bills</label>
              <input
                type="number"
                value={availableBills[bill]}
                onChange={e => handleBillChange(bill, e.target.value)}
                placeholder="0"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary text-sm"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="mt-4 bg-primary hover:bg-primary-hover text-text px-6 py-2 rounded-lg transition font-semibold"
        >
          {loading ? 'Calculating...' : 'Calculate Breakdown'}
        </button>
      </div>

      {/* Results */}
      {breakdown && (
        <>
          <ul>
            {breakdown.results.map((person, index) => (
              <li key={index} className="px-6 py-4 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-text">{person.name}</p>
                  <p className="text-text font-bold">${person.allocated}</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {BILLS.map(bill => (
                    person.breakdown[bill] ? (
                      <span key={bill} className="text-sm text-text-muted bg-background px-2 py-1 rounded">
                        {person.breakdown[bill]} × ${bill}
                      </span>
                    ) : null
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {/* Bonus Pool */}
          <div className="p-6 border-t border-border bg-background rounded-b-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-text">Bonus Pool</p>
                <p className="text-text-muted text-sm">Unallocated amount — manager discretion</p>
              </div>
              <p className="text-2xl font-bold text-primary">${breakdown.totalBonus.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}