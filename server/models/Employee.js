const pool = require('../db')

/*
    Employee class that represents all attributes that employees have. As well as
    including setter and getter functions

    @params String name, String[] roles
    @author Roy Corella
*/

class Employee {
  constructor(name, roles) {
    this._name = name
    this._roles = roles
    this._id = null
  }

  get id() { return this._id }
  get name() { return this._name }
  get roles() { return this._roles }

  async save() {
    const result = await pool.query(
      'INSERT INTO employees (name, roles) VALUES ($1, $2) RETURNING id',
      [this._name, JSON.stringify(this._roles)]
    )
    this._id = result.rows[0].id
    return this
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM employees')
    return result.rows.map(e => ({
      ...e,
      roles: JSON.parse(e.roles)  // Translates the incoming JSON data, roles, back into a usable javascript array
    }))
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id])
    if (!result.rows[0]) return null
    return {
      ...result.rows[0],
      roles: JSON.parse(result.rows[0].roles)
    }
  }

  static async getByName(name) {
    const result = await pool.query('SELECT * FROM employees WHERE name = $1', [name])
    if (!result.rows[0]) return null
    return {
      ...result.rows[0],
      roles: JSON.parse(result.rows[0].roles)
    }
  }

  static async delete(id) {
    await pool.query('DELETE FROM employees WHERE id = $1', [id])
  }
}

module.exports = Employee