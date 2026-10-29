import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const roleLabels = {
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Contratista',
}

function Header({ session, cartCount, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const canManageStock = ['ADMINISTRADOR', 'VENDEDOR'].includes(session.role)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <a className="skip-link" href="#contenido-principal">Saltar al contenido</a>
      <div className="header-bar container">
        <NavLink className="brand" to="/" onClick={closeMenu}>
          <img src="/logo.svg" alt="" width="48" height="48" />
          <span>
            <strong>Los Maestros</strong>
            <small>Ferretería y construcción</small>
          </span>
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">☰</span>
          <span>Menú</span>
        </button>

        <nav id="menu-principal" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Principal">
          <NavLink to="/catalogo" onClick={closeMenu}>Catálogo</NavLink>
          <NavLink to="/categorias" onClick={closeMenu}>Categorías</NavLink>
          <NavLink to="/ofertas" onClick={closeMenu}>Ofertas</NavLink>
          <NavLink to="/ubicacion" onClick={closeMenu}>Despacho</NavLink>
          <NavLink to="/mi-cuenta" onClick={closeMenu}>Mi cuenta</NavLink>
          {canManageStock && <NavLink to="/inventario" onClick={closeMenu}>Inventario</NavLink>}
          {session.role === 'ADMINISTRADOR' && (
            <NavLink to="/administracion" onClick={closeMenu}>Administración</NavLink>
          )}
          <NavLink className="cart-link" to="/carrito" onClick={closeMenu}>
            Carrito <span aria-label={`${cartCount} productos`}>{cartCount}</span>
          </NavLink>
          <div className="session-menu">
            <span>{roleLabels[session.role]}</span>
            <button type="button" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
