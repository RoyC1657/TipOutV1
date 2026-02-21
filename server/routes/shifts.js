const express = require('express')
const router = express.Router()
const Shift = require('../models/Shift')
const { calculateDenominations } = require('../denominationCalculator')

// GET all shifts
router.get('/', async (_req, res) => {
  const shifts = await Shift.getAll()
  res.json(shifts)
})

// POST - create a new shift
router.post('/', async (req, res) => {
  const { date, total_cash, total_credit } = req.body
  const shift = await new Shift(date, total_cash, total_credit).save()
  res.json({ id: shift.id, date, total_cash, total_credit })
})

// POST - add an employee to shift
router.post('/:id/employees', async (req, res) => {
  const { employee_id, hours_worked, role_worked } = req.body
  const shift = await Shift.getById(req.params.id)
  if (!shift) return res.status(404).json({ message: 'Shift not found' })
  await shift.addEmployee(employee_id, hours_worked, role_worked)
  res.json({ message: 'Employee added to shift' })
})

// POST - calculate denominations for a shift based on available bills and payouts
router.post('/:id/denominations', async (req, res) => {
  const { availableBills, payouts } = req.body
  const result = calculateDenominations(payouts, availableBills)
  res.json(result)
})

// GET - full summary of shift including workers
router.get('/:id/summary', async (req, res) => {
  const shift = await Shift.getById(req.params.id)
  if (!shift) return res.status(404).json({ message: 'Shift not found' })
  res.json(await shift.getSummary())
})

// GET - calculate tipout for a shift
router.get('/:id/calculate', async (req, res) => {
  const shift = await Shift.getById(req.params.id)
  if (!shift) return res.status(404).json({ message: 'Shift not found' })
  const results = await shift.calculate()
  res.json(results)
})

// DELETE - remove a shift
router.delete('/:id', async (req, res) => {
  await Shift.delete(req.params.id)
  res.json({ message: 'Shift deleted' })
})

module.exports = router
