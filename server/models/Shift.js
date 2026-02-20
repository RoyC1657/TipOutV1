const db = require('../db')

class Shift {
    #shiftID
    #date
    #supportHours
    #serverHours
    #totalCashTip
    #totalCreditTip
    #totalTip
    
    constructor(date, totalCashTip, totalCreditTip) {
        this.#date = date
        this.#totalCashTip = totalCashTip
        this.#totalCreditTip = totalCreditTip
        this.#totalTip = totalCashTip + totalCreditTip
    }

    save() {
        const result = db.prepare(
            'INSERT INTO Shifts (date, total_cash, total_credit) VALUES (?, ?, ?)'
        ).run(this.#date, this.#totalCashTip, this.totalCreditTip)
        this.#shiftID = result.lastInsertRowid
        return this
    }

    get shiftID() {return this.#shiftID}
    get date() {return this.#date }
    get totalCashTip() {return this.#totalCashTip }
    get totalCreditTip() { return this.#totalCreditTip}

    //Adds Employee to current shift
    addEmployee(employeeId, hoursWorked) {
        db.prepare(
            'INSERT INTO shift_employees (shift_id, employee_id, hours_worked) VALUES (?, ?, ?)'
        ).run(this.#shiftID, employeeId, hoursWorked )
        return this
    }

    //Gets all employees who worked on this shift
    getEmployees() {
    return db.prepare(`
      SELECT se.hours_worked, e.name, e.roles
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
        .filter(e => e.roles.includes('server') || e.roles.includes('bartender'))
        .reduce((total, e) => total + e.hoursWorked, 0)    //Calculates total server hours worked this shift
  }

   getSupportHours() {
    const employees = this.getEmployees()
    return employees
        .filter(e => e.roles.includes('foodrunner') || e.roles.includes('barback'))
        .reduce((total, e) => total + e.hoursWorked, 0)    //Calculates total support hours worked this shift
  }

  // Get a full summary of the shift including all workers
  getSummary(){
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

  static getAll() {
    return db.prepare('SELECT * FROM shifts').all()
  }

  static delete(id) {
    return db.prepare('DELETE FROM shifts WHERE id = ?').run(id)
  }
}

module.exports = Shift