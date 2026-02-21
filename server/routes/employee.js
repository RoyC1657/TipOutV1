const express = require('express')
const router = express.Router()
const Employee = require('../models/Employee')

//GET all employees
router.get('/',(req,res) => {
    const employees = Employee.getAll()
    res.json(employees)
})

//POST - add a new employee
router.post('/', (req, res) => {
    const { name, roles } = req.body
    const employee = new Employee(name, roles).save()
    res.json(employee)
})

//DELETE - remove an employee
router.delete('/:id', (req, res) => {
    Employee.delete(req.params.id)
    res.json({ message: 'Employee deleted' })
})

module.exports = router