import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import CreateShift from './pages/CreateShift'
import Results from './pages/Results'
import ShiftHistory from './pages/ShiftHistory'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/create-shift" element={<CreateShift />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/history" element={<ShiftHistory />} />
        </Routes>
      </main>
    </div>
  )
}
