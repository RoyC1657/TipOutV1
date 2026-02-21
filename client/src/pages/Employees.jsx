import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Employees() {
   const [employees, setEmployees] = useState([])
const [name, setName] = useState('')
const [roles, setRoles] = useState([])
    const availableRoles = ['server', 'bartender', 'foodrunner', 'barback']

    // fetch all employees when page loads
    useEffect(() => {
        fetchEmployees()

    }, [])

    function fetchEmployees () {
        axios.get(`${import.meta.env.VITE_API_URL}/employees`)
            .then(response => setEmployees(response.data))
    }

    // Toggle a role on or off when checkbox is clicked
    function handleRoleToggle(role) {
        if (roles.includes(role)) {
            setRoles(roles.filter(r => r !== role))
    }   else {
            setRoles([...roles, role])
    }
  }

  // Submit the form to add a new employee
  function handleSubmit(e) {
    e.preventDefault()
    if (!name || roles.length === 0) return
    axios.post(`${import.meta.env.VITE_API_URL}/employees`, { name, roles })

        .then(() => {
            fetchEmployees()
            setName(' ')
            setRoles([])
        })
  }


// Delete an employee
function handleDelete(id) {
    axios.delete(`${import.meta.env.VITE_API_URL}/employees/${id}`)
        .then(() => fetchEmployees())
}

return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text">Employees</h1>

      {/* Add Employee Form */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <h2 className="text-xl font-semibold mb-4 text-text">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-text-muted mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Employee name"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">Roles</label>
            <div className="flex gap-4">
              {availableRoles.map(role => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="accent-primary"
                  />
                  <span className="capitalize text-sm text-text">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-text px-6 py-2 rounded-lg transition"
          >
            Add Employee
          </button>

        </form>
      </div>

      {/* Employee List */}
      <div className="bg-surface rounded-xl border border-border">
        <h2 className="text-xl font-semibold p-6 border-b border-border text-text">Staff</h2>
        {employees.length === 0 ? (
          <p className="text-text-muted p-6">No employees yet. Add one above.</p>
        ) : (
          <ul>
            {employees.map(emp => (
              <li key={emp.id} className="flex items-center justify-between px-6 py-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-text">{emp.name}</p>
                  <p className="text-sm text-text-muted capitalize">{emp.roles.join(', ')}</p>
                </div>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="text-danger hover:text-red-300 text-sm transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}
