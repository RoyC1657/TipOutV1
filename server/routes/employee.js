const express = require('express')
const router = express.Router()
const db = require('../db')

//GET all employees
router.get('/',(req,res) => {
    const employees = db.prepare('SELECT * FROM employees').all()
    res.json(employees)
})

//POST - add a new employee
router.post('/', (req, res) => {
    const { name, role } = req.body
    const result = db.prepare('INSERT INTO employees (name, role) VALUES (?,?)').run(name,role)
    res.json({ id: result.lastInsertRowid, name, role })
})

module.exports = router