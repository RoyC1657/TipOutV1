const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      roles TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shifts (
      id SERIAL PRIMARY KEY,
      date TEXT NOT NULL,
      total_cash REAL NOT NULL,
      total_credit REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS shift_employees (
      id SERIAL PRIMARY KEY,
      shift_id INTEGER NOT NULL,
      employee_id INTEGER NOT NULL,
      hours_worked REAL NOT NULL,
      role_worked TEXT NOT NULL,
      FOREIGN KEY (shift_id) REFERENCES shifts(id),
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    );
  `)
}

initDB()

module.exports = pool