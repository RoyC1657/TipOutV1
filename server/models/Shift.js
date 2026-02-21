const db = require('../db')
const { calculateTipout } = require('../tipoutCalculator')

class Shift {
  #shiftID
  #date
  #totalCashTip
  #totalCreditTip
  #totalTip

  constructor(date, totalCashTip, totalCreditTip) {
    this.#date = date
    this.#totalCashTip = totalCashTip
    this.#totalCreditTip = totalCreditTip
    this.#totalTip = totalCashTip + totalCreditTip
  }

  get id() { return this.#shiftID }
  get date() { return this.#date }
  get totalCash() { return this.#totalCashTip }
  get totalCredit() { return this.#totalCreditTip }

  save() {
    const result = db.prepare(
      'INSERT INTO shifts (date, total_cash, total_credit) VALUES (?, ?, ?)'
    ).run(this.#date, this.#totalCashTip, this.#totalCreditTip)
    this.#shiftID = result.lastInsertRowid
    return this
  }

  addEmployee(employeeId, hoursWorked, roleWorked) {
    db.prepare(
      'INSERT INTO shift_employees (shift_id, employee_id, hours_worked, role_worked) VALUES (?, ?, ?, ?)'
    ).run(this.#shiftID, employeeId, hoursWorked, roleWorked)
    return this
  }

  getEmployees() {
    return db.prepare(`
      SELECT se.hours_worked, se.role_worked, e.name, e.roles
      FROM shift_employees se
      JOIN employees e ON se.employee_id = e.id
      WHERE se.shift_id = ?
    `).all(this.#shiftID).map(e => ({
      ...e,
      roles: JSON.parse(e.roles)
    }))
  }

  getServerHours() {
    const employees = this.getEmployees()
    return employees
      .filter(e => e.role_worked === 'server' || e.role_worked === 'bartender')
      .reduce((total, e) => total + e.hours_worked, 0)
  }

  getSupportHours() {
    const employees = this.getEmployees()
    return employees
      .filter(e => e.role_worked === 'foodrunner' || e.role_worked === 'barback')
      .reduce((total, e) => total + e.hours_worked, 0)
  }

  getSummary() {
    const employees = this.getEmployees()
    return {
      id: this.#shiftID,
      date: this.#date,
      totalCash: this.#totalCashTip,
      totalCredit: this.#totalCreditTip,
      serverHours: this.getServerHours(),
      supportHours: this.getSupportHours(),
      workers: employees
    }
  }

  calculate() {
    const employees = this.getEmployees()
    return calculateTipout(this, employees)
  }

  static getAll() {
    return db.prepare('SELECT * FROM shifts').all()
  }

  static getById(id) {
    const data = db.prepare('SELECT * FROM shifts WHERE id = ?').get(id)
    if (!data) return null
    const shift = new Shift(data.date, data.total_cash, data.total_credit)
    shift.#shiftID = data.id
    return shift
  }

  static delete(id) {
    return db.prepare('DELETE FROM shifts WHERE id = ?').run(id)
  }
}

module.exports = Shift