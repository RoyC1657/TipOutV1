import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ShiftHistory() {
    const [shifts, setShifts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/shifts`)
            .then(response => setShifts(response.data))
    }, [])
    
    function handleDelete(id) {
        axios.delete(`${import.meta.env.VITE_API_URL}/shifts/${id}`)
        .then(() => {
            setShifts(shifts.filter(shift => shift.id !== id))
        })
    }

    return ( 
     <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text">Shift History</h1>

      {shifts.length === 0 ? (
        <p className="text-text-muted">No shifts recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {shifts.map(shift => (
            <div key={shift.id} className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-text">{shift.date}</h2>
                  <p className="text-text-muted text-sm">
                    Cash: ${shift.total_cash.toFixed(2)} · Credit: ${shift.total_credit.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/results/${shift.id}`)}
                    className="bg-primary hover:bg-primary-hover text-text px-4 py-2 rounded-lg text-sm transition"
                  >
                    View Results
                  </button>
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="text-danger hover:text-red-300 text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
