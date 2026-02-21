# TipOut Calculator

A full stack web application that automates tip distribution calculations for restaurant staff. Built to solve a real problem — manually calculating tipouts is time-consuming and error-prone. This app handles the math instantly and accurately.

**Live Demo:** [clydztipout.vercel.app](https://clydztipout.vercel.app)

---

## What It Does

Restaurants typically split tips between servers/bartenders and support staff (foodrunners/barbacks). This app:

- Calculates each employee's cash and credit tipout based on hours worked and role
- Distributes 85% of tips to the server pool and 15% to the support pool
- Breaks down exact bill denominations for cash payouts so managers know exactly what bills to hand each person
- Tracks shift history so past tipouts can be reviewed at any time

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express
- PostgreSQL
- pg (node-postgres)

**Deployment**
- Frontend: Vercel
- Backend + Database: Railway

---

## Features

- **Employee Management** — Add and remove staff with their eligible roles
- **Shift Creation** — Enter shift date, total cash tips, total credit tips, and select which employees worked with their hours and role worked that shift
- **Tipout Calculation** — Automatically calculates each person's payout for both cash and credit tips
- **Cash Denomination Breakdown** — Enter available bills and the app calculates the exact denominations to give each person. Any unallocatable cents are tracked as a bonus pool
- **Shift History** — View all past shifts and pull up results for any previous shift

---

## How the Calculation Works

```
Total Cash Tips × 85% = Server Pool
Total Cash Tips × 15% = Support Pool

Server Pool ÷ Total Server Hours = Server Rate ($/hr)
Support Pool ÷ Total Support Hours = Support Rate ($/hr)

Individual Payout = Hours Worked × Their Rate
```

Servers and bartenders draw from the server pool. Foodrunners and barbacks draw from the support pool. The same calculation runs separately for cash and credit tips.

---

## Running Locally

**Prerequisites**
- Node.js
- PostgreSQL

**Clone the repo**
```bash
git clone https://github.com/RoyC1657/TipOutV1.git
cd tipout-calculator
```

**Set up the backend**
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
DATABASE_URL=postgresql://localhost/tipout
PORT=3000
```

Start the server:
```bash
npm run dev
```

**Set up the frontend**
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```
VITE_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## Project Structure

```
tipout-calculator/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── DenominationCalculator.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── CreateShift.jsx
│   │   │   ├── Results.jsx
│   │   │   └── ShiftHistory.jsx
│   │   └── App.jsx
└── server/                   # Express backend
    ├── models/
    │   ├── Employee.js
    │   └── Shift.js
    ├── routes/
    │   ├── employees.js
    │   └── shifts.js
    ├── db.js
    ├── index.js
    ├── tipoutCalculator.js
    └── denominationCalculator.js
```

---

## Author

Roy Corella
