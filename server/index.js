const express = require('express')
const cors = require('cors')
const db = require('./db')
const employeeRoutes = require('./routes/employee')

const app = express()
const PORT = 3000

/*
    Middleware - cors allows server to communicate with Reach which runs on a different port
    Express.json translates the incoming JSON file from the React app into data the server can use
*/
app.use(cors())
app.use(express.json())

app.use('/employees', employeeRoutes)

app.get('/',(req, res) => {
    res.send("TipOutV1 is Running...")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

