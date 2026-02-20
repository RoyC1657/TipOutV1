const db = require('../db')

/*
    Employee class that represents all atributes that employees have. As well as
    including setter and getter functions

    @params String name, String[] roles
    @author Roy Corella
*/

class Employee {
  constructor(name, roles) {
    this.name = name
    this.roles = roles
  }

  save() {
    const result = db.prepare(
      'INSERT INTO employees (name, roles) VALUES (?, ?)'
    ).run(this.name, JSON.stringify(this.roles))
    this.id = result.lastInsertRowid
    return this
  }


  static getAll() {
    const employees = db.prepare('SELECT * FROM employees').all()
    return employees.map(e => ({
      ...e,
      roles: JSON.parse(e.roles)     //Translates the incoming JSON data, roles, back into a usable javascript array
    }))
  }

  static getById(id) {
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id)
    if (!employee) return null
    return {
      ...employee,
      roles: JSON.parse(employee.roles)
    }
  }

  static getByName(name) {
    const employee = db.prepare('SELECT * FROM employees WHERE name = ?').get(name)
    if (!employee) return null
    return {
        ...employee,
        roles: JSON.parse(employee.roles)
    }
  }

  static delete(id) {
    return db.prepare('DELETE FROM employees WHERE id = ?').run(id)
  }

}

module.exports = Employee