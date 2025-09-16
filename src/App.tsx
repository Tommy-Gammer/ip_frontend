import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/Home'
import FilmsPage from './pages/Films'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffffff 0%, #000000ff 100%)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>Sakila Database Queries</span>
            </div>

            <nav style={{ display: 'flex', gap: 30 }}>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  color: isActive ? '#1f2937' : '#6b7280',
                  textDecoration: 'none',
                  fontWeight: 500,
                })}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/films"
                style={({ isActive }) => ({
                  color: isActive ? '#1f2937' : '#6b7280',
                  textDecoration: 'none',
                  fontWeight: 500,
                })}
              >
                Films
              </NavLink>
              <NavLink
                to="/customers"
                style={({ isActive }) => ({
                  color: isActive ? '#1f2937' : '#6b7280',
                  textDecoration: 'none',
                  fontWeight: 500,
                })}
              >
                Customers
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/films" element={<FilmsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
