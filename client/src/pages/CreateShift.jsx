import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CreateShift() { 
    const navigate = useNavigate()

    const [date, setDate] = useState('')
    const [totalCash, setTotalCash] = useState('')
    const [totalCredit, setTotalCredit] = useState('')
    const [employees, setEmployees] = useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([])

    // Fetch all employees when page loads
    useEffect(() => {
        axios.get('http://localhost:3000/employees')
            .then(response => setEmployees(response.data))
    }, [])

    // Toggle employee selection when checkbox is clicked
    function handleEmployeeToggle(employee) {
        const alreadySelected = selectedEmployees.find(e => e.id === employee.id)
        if (alreadySelected) {
            setSelectedEmployees(selectedEmployees.filter(e => e.id !== employee.id))
        } else {
            setSelectedEmployees([...selectedEmployees,  {
                id: employee.id,
                name: employee.name,
                roles: employee.roles,
                hours: '',
                roleWorked: employee.roles[0] 
            }])
        }
    }

    // Update hours or role worked for a selected employee
    function handleHoursChange(id, hours) {
        setSelectedEmployees(selectedEmployees.map(e => 
            e.id === id ? { ...e, hours } : e    // Update hours for the employee with matching id
        ))
    }

   
    // Update role worked for a selected employee
    function handleRoleWorkedChange(id, roleWorked) {
        setSelectedEmployees(selectedEmployees.map(e => 
            e.id === id ? { ...e, roleWorked } : e    // Update roleWorked for the employee with matching id
        ))
    }

    // Submit the form to create a new shift
    async function handleSubmit(e) {
        e.preventDefault()
        if (!date || !totalCash || !totalCredit || selectedEmployees.length === 0) return
        
        try {
            //Create the shift
            const shiftResponse = await axios.post('http://localhost:3000/shifts', {
                date,
                total_cash: parseFloat(totalCash),
                total_credit: parseFloat(totalCredit)
            })

            console.log('shift response:', shiftResponse.data)
            const shiftId = shiftResponse.data.id
            console.log('shift id:', shiftId)


            // Add each employee to the shift with their hours and role worked
            await Promise.all(selectedEmployees.map(emp => 
                axios.post(`http://localhost:3000/shifts/${shiftId}/employees`, {
                    employee_id: emp.id,
                    hours_worked: parseFloat(emp.hours),
                    role_worked: emp.roleWorked
                })
            ))

            // Navigate to the results page for the new shift
            navigate(`/results/${shiftId}`)
        } catch (error) {
            console.error('Error creating shift:', error)
        }
    }


 return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text">New Shift</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Shift Details */}
        <div className="bg-surface rounded-xl p-6 border border-border space-y-4">
          <h2 className="text-xl font-semibold text-text">Shift Details</h2>

          <div>
            <label className="block text-sm text-text-muted mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Total Cash Tips</label>
            <input
              type="number"
              value={totalCash}
              onChange={e => setTotalCash(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Total Credit Tips</label>
            <input
              type="number"
              value={totalCredit}
              onChange={e => setTotalCredit(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Select Employees */}
        <div className="bg-surface rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-text mb-4">Who Worked?</h2>
          <div className="space-y-3">
            {employees.map(emp => {
              const isSelected = selectedEmployees.find(e => e.id === emp.id)
              return (
                <div key={emp.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={!!isSelected}
                      onChange={() => handleEmployeeToggle(emp)}
                      className="accent-primary"
                    />
                    <div>
                      <p className="font-medium text-text">{emp.name}</p>
                      <p className="text-sm text-text-muted capitalize">{emp.roles.join(', ')}</p>
                    </div>
                  </div>

                  {/* Hours and role worked - only show if selected */}
                  {isSelected && (
                    <div className="flex gap-4 mt-2 pl-7">
                      <div className="flex-1">
                        <label className="block text-xs text-text-muted mb-1">Hours Worked</label>
                        <input
                          type="number"
                          value={isSelected.hours}
                          onChange={e => handleHoursChange(emp.id, e.target.value)}
                          placeholder="0"
                          className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-text placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-text-muted mb-1">Role Worked</label>
                        <select
                          value={isSelected.roleWorked}
                          onChange={e => handleRoleWorkedChange(emp.id, e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-text focus:outline-none focus:border-primary text-sm"
                        >
                          {emp.roles.map(role => (
                            <option key={role} value={role} className="bg-background">
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-text py-3 rounded-lg font-semibold transition"
        >
          Calculate Tipout
        </button>

      </form>
    </div>
  )
}