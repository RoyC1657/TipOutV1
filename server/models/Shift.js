const pool = require('../db')
const { calculateTipout } = require('../tipoutCalculator')

class Shift {
  constructor(date, totalCashTip, totalCreditTip) {
    this._date = date
    this._totalCashTip = totalCashTip
    this._totalCreditTip = totalCreditTip
    this._totalTip = totalCashTip + totalCreditTip
    this._id = null
  }

  get id() { return this._id }
  get date() { return this._date }
  get totalCash() { return this._totalCashTip }
  get totalCredit() { return this._totalCreditTip }

  async save() {
    const result = await pool.query(
      'INSERT INTO shifts (date, total_cash, total_credit) VALUES ($1, $2, $3) RETURNING id',
      [this._date, this._totalCashTip, this._totalCreditTip]
    )
    this._id = result.rows[0].id
    return this
  }

  async addEmployee(employeeId, hoursWorked, roleWorked) {
    await pool.query(
      'INSERT INTO shift_employees (shift_id, employee_id, hours_worked, role_worked) VALUES ($1, $2, $3, $4)',
      [this._id, employeeId, hoursWorked, roleWorked]
    )
    return this
  }

  async getEmployees() {
    const result = await pool.query(`
      SELECT se.hours_worked, se.role_worked, e.name, e.roles
      FROM shift_employees se
      JOIN employees e ON se.employee_id = e.id
      WHERE se.shift_id = $1
    `, [this._id])
    return result.rows.map(e => ({
      ...e,
      roles: JSON.parse(e.roles)
    }))
  }

  async getServerHours() {
    const employees = await this.getEmployees()
    return employees
      .filter(e => e.role_worked === 'server' || e.role_worked === 'bartender')
      .reduce((total, e) => total + e.hours_worked, 0)
  }

  async getSupportHours() {
    const employees = await this.getEmployees()
    return employees
      .filter(e => e.role_worked === 'foodrunner' || e.role_worked === 'barback')
      .reduce((total, e) => total + e.hours_worked, 0)
  }

  async getSummary() {
    const employees = await this.getEmployees()
    return {
      id: this._id,
      date: this._date,
      totalCash: this._totalCashTip,
      totalCredit: this._totalCreditTip,
      serverHours: await this.getServerHours(),
      supportHours: await this.getSupportHours(),
      workers: employees
    }
  }

  async calculate() {
    const employees = await this.getEmployees()
    return calculateTipout(this, employees)
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM shifts')
    return result.rows
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM shifts WHERE id = $1', [id])
    if (!result.rows[0]) return null
    const data = result.rows[0]
    const shift = new Shift(data.date, data.total_cash, data.total_credit)
    shift._id = data.id
    return shift
  }

  static async delete(id) {
    await pool.query('DELETE FROM shifts WHERE id = $1', [id])
  }
}

module.exports = Shift