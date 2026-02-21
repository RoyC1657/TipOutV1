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
        axios.get('http://localhost:3000/employees')
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
    axios.post('http://localhost:3000/employees', { name, roles })
        .then(() => {
            fetchEmployees()
            setName(' ')
            setRoles([])
        })
  }


// Delete an employee
function handleDelete(id) {
    axios.delete(`http://localhost:3000/employees/${id}`)
        .then(() => fetchEmployees())
}

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Employees</h1>

      {/* Add Employee Form */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Employee name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Roles</label>
            <div className="flex gap-4">
              {availableRoles.map(role => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="accent-blue-500"
                  />
                  <span className="capitalize text-sm">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition"
          >
            Add Employee
          </button>

        </form>
      </div>

      {/* Employee List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-800">Staff</h2>
        {employees.length === 0 ? (
          <p className="text-gray-500 p-6">No employees yet. Add one above.</p>
        ) : (
          <ul>
            {employees.map(emp => (
              <li key={emp.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-800 last:border-0">
                <div>
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{emp.roles.join(', ')}</p>
                </div>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition"
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
