// Tipout percentages - adjustable from settings menu later
const TIPOUT_CONFIG = {
    serverPoolPercent: 0.85,
    supportPoolPercent: 0.15
}

// Main function - only function actually called from the outside
function calculateTipout(shift, employees, config = TIPOUT_CONFIG) {
    return ['cash', 'credit'].map(type => {
        const total = type === 'cash' ? shift.totalCash : shift.totalCredit
        return calculatePoolResult(type, total, employees, config)
    })
}

// Helper - determines what category an employee belones to
function getEmployeeCategory(employee) {
    if(employee.role_worked === 'server' || employee.role_worked === 'bartender'){
        return 'server'
    }
    if (employee.role_worked === 'foodrunner' || employee.role_worked === 'barback') {
        return 'support'
    }
    return null
}

// Helper - adds up total hours for a specific category
function getTotalHours(employees, category) {
    return employees
    .filter(e => getEmployeeCategory(e) === category) //Checks to see if employee category matches the parameter category
    .reduce((total, e)  => total + e.hours_worked, 0)    //Adds up total hourse worked by a specified category of workers
}

// Helper - calculates one persons individual payout
function calculateIndividualPayout(employee, serverRate, supportRate) {
    const category = getEmployeeCategory(employee)
    const rate = category === 'server' ? serverRate : supportRate //Sets rate perhour based on category worked as
    return {
        name: employee.name,
        roles: employee.roles,
        role_worked: employee.role_worked,
        hours: employee.hours_worked,
        payout: parseFloat((rate * employee.hours_worked).toFixed(2))  //Calculates tipout as rate * hours worked
    }
}

// Helper - runs the math for one type (cash or credit)
function calculatePoolResult(type, total, employees, config) {
    const supportPool = total * config.supportPoolPercent
    const serverPool = total * config.serverPoolPercent

    const serverHours = getTotalHours(employees, 'server')
    const supportHours = getTotalHours(employees, 'support')

    const serverRate = serverPool / serverHours
    const supportRate = supportPool / supportHours

    const payouts = employees.map(e => 
        calculateIndividualPayout(e, serverRate, supportRate)
    )

     return { type, total, serverHours, supportHours, serverRate, supportRate, payouts }
}

module.exports = { calculateTipout, TIPOUT_CONFIG }
