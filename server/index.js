const express = require('express')
const cors = require('cors')
const db = require('./db')

const employeeRoutes = require('./routes/employee')
const shiftRoutes = require('./routes/shifts')

const app = express()
const PORT = 3000

/*
    Middleware - cors allows server to communicate with Reach which runs on a different port
    Express.json translates the incoming JSON file from the React app into data the server can use
*/
app.use(cors({
  origin: ['http://localhost:5173', 'https://tip-out-v1.vercel.app']
}))

app.use(express.json())

app.use('/employees', employeeRoutes)
app.use('/shifts', shiftRoutes)

app.get('/',(req, res) => {
    res.send("TipOutV1 is Running...")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

