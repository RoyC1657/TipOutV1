import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">TipOut Calculator</h1>
        <div className="flex gap-6">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            Dashboard
          </Link>
          <Link to="/employees" className="text-gray-300 hover:text-white transition">
            Employees
          </Link>
          <Link to="/create-shift" className="text-gray-300 hover:text-white transition">
            New Shift
          </Link>
          <Link to="/history" className="text-gray-300 hover:text-white transition">
            History
          </Link>
        </div>
      </div>
    </nav>
  )
}