const express = require('express')
const router = express.Router()
const db = require('../db')

// GET all shifts
router.get('/', (req, res) => {
    const shifts = db.prepare('SELECT * FROM shifts').all()
    res.json(shifts)
})

// POST - create a new shift
router.post('/', (req, res) => {
    const {date , total_cash, total_credit } = req.body
    const result = db.prepare(
        'INSERT INTO shifts (date, total_cash, total_credit) VALUES (?, ?, ?)'
    ).run(date, total_cash, total_credit)
    res.json({ id: result.lastInsertRowid, date, total_cash, total_credit })
})

//POST - add an employee to shift
router.post('/:id/employees', (req, res) => {
    const { employee_id, hours_worked } = req.body
    const shift_id = req.params.id
    const result = db.prepare(
        'INSERT INTO shift_employees (shift_id, employee_id, hours_worked) VALUES (?, ?, ?)'
    ).run(shift_id, employee_id, hours_worked)
    res.json({ id: result.lastInsertRowid, shift_id, employee_id, hours_worked })

})

module.exports = router