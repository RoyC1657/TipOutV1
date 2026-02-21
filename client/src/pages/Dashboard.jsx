import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
    const navigate = useNavigate()
    const [shifts, setShifts] = useState([])
    const [employees, setEmployees] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/shifts`)
            .then(response => setShifts(response.data))
        axios.get('http://localhost:3000/employees')
            axios.get(`${import.meta.env.VITE_API_URL}/employees`)
    }, [])

    const totalCash = shifts.reduce((total, s) => total + s.total_cash, 0)
    const totalCredit = shifts.reduce((total, s) => total + s.total_credit, 0)
    const recentShifts = shifts.slice(-5).reverse() // Get last 5 shifts

     return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome to TipOut Calculator</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <p className="text-text-muted text-sm">Total Shifts</p>
          <p className="text-text text-3xl font-bold mt-1">{shifts.length}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border">
          <p className="text-text-muted text-sm">Total Employees</p>
          <p className="text-text text-3xl font-bold mt-1">{employees.length}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border">
          <p className="text-text-muted text-sm">Total Cash Tips</p>
          <p className="text-text text-3xl font-bold mt-1">${totalCash.toFixed(2)}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border">
          <p className="text-text-muted text-sm">Total Credit Tips</p>
          <p className="text-text text-3xl font-bold mt-1">${totalCredit.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/create-shift')}
            className="bg-primary hover:bg-primary-hover text-text px-6 py-3 rounded-lg font-semibold transition"
          >
            New Shift
          </button>
          <button
            onClick={() => navigate('/employees')}
            className="bg-surface border border-border hover:border-primary text-text px-6 py-3 rounded-lg font-semibold transition"
          >
            Manage Employees
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-surface border border-border hover:border-primary text-text px-6 py-3 rounded-lg font-semibold transition"
          >
            View History
          </button>
        </div>
      </div>

      {/* Recent Shifts */}
      <div className="bg-surface rounded-xl border border-border">
        <h2 className="text-xl font-semibold p-6 border-b border-border text-text">Recent Shifts</h2>
        {recentShifts.length === 0 ? (
          <p className="text-text-muted p-6">No shifts yet. Create your first shift above.</p>
        ) : (
          <ul>
            {recentShifts.map(shift => (
              <li
                key={shift.id}
                onClick={() => navigate(`/results/${shift.id}`)}
                className="flex items-center justify-between px-6 py-4 border-b border-border last:border-0 cursor-pointer hover:bg-background transition"
              >
                <div>
                  <p className="font-medium text-text">{shift.date}</p>
                  <p className="text-sm text-text-muted">
                    Cash: ${shift.total_cash.toFixed(2)} · Credit: ${shift.total_credit.toFixed(2)}
                  </p>
                </div>
                <span className="text-text-muted text-sm">View →</span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}