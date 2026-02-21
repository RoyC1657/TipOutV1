const express = require('express')
const router = express.Router()
const Shift = require('../models/Shift')

// GET all shifts
router.get('/', (req, res) => {
    const shifts = Shift.getAll()
    res.json(shifts)
})

// POST - create a new shift
router.post('/', (req, res) => {
    const {date , total_cash, total_credit } = req.body
    const shift = new Shift(date, total_cash, total_credit).save()
    res.json(shift)
})

// POST - add an employee to shift
router.post('/:id/employees', (req, res) => {
    const { employee_id, hours_worked } = req.body
    const shift = Shift.getById(req.params.id)

    res.json({ id: result.lastInsertRowid, shift_id, employee_id, hours_worked })
    Shift.addEmployee(employee_id, hours_worked)
    res.json({ message: 'Employee added to shift'})
})

// GET - full summary of shift including workers
router.get('/:id/summary', (req, res) => {
    const shift = Shift.getById(req.params.id)
    if (!shift) return res.status(404).json({ message: 'Shift not found' })
    res.json(shift.getSummary())
})

//GEt - calculate tippout for a shift
router.get('/:id/calculate', (req, res) => {
    const shift = Shift.getById(req.params.id)
    if (!shift) return res.status(404).json({message: 'Shift not found'})
    const results = shift.calculate()
    res.json(results)
})

// DELETE - remove a shift
router.delete(`:id`, (req, res) => {
    Shift.delete(req.params.id)
    res.json({ message: 'Shift deleted' })
})

module.exports = router