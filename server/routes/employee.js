const express = require('express')
const router = express.Router()
const Employee = require('../models/Employee')

//GET all employees
router.get('/', async (_req, res) => {
    const employees = await Employee.getAll()
    res.json(employees)
})

//POST - add a new employee
router.post('/', async (req, res) => {
    const { name, roles } = req.body
    const employee = await new Employee(name, roles).save()
    res.json(employee)
})

//DELETE - remove an employee
router.delete('/:id', async (req, res) => {
    await Employee.delete(req.params.id)
    res.json({ message: 'Employee deleted' })
})

module.exports = router
