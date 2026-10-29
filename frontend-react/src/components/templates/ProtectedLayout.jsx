import { Navigate, Outlet } from 'react-router-dom'
import Footer from '../organisms/Footer.jsx'
import Header from '../organisms/Header.jsx'

function ProtectedLayout({ session, cartCount, onLogout }) {
  if (!session) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <Header session={session} cartCount={cartCount} onLogout={onLogout} />
      <main id="contenido-principal" className="site-main"><Outlet /></main>
      <Footer />
    </div>
  )
}

export default ProtectedLayout
