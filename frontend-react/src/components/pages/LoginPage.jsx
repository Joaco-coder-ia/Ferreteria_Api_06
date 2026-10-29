import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const demoUsers = [
  { email: 'admin@losmaestros.cl', password: 'demo123', role: 'ADMINISTRADOR', name: 'Dueño' },
  { email: 'vendedor@losmaestros.cl', password: 'demo123', role: 'VENDEDOR', name: 'Vendedor' },
  { email: 'contratista@demo.cl', password: 'demo123', role: 'CLIENTE', name: 'Contratista demo' },
]

function LoginPage({ session, onLogin }) {
  const [email, setEmail] = useState(demoUsers[2].email)
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  if (session) {
    return <Navigate to="/" replace />
  }

  const submit = (event) => {
    event.preventDefault()
    const user = demoUsers.find((item) => item.email === email && item.password === password)
    if (!user) {
      setError('Correo o contraseña incorrectos para la demostración.')
      return
    }
    setError('')
    onLogin({ email: user.email, role: user.role, name: user.name })
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <img src="/logo.svg" width="72" height="72" alt="" />
        <p className="eyebrow">Ferretería Los Maestros</p>
        <h1>Stock claro, pedidos simples.</h1>
        <p>
          Una maqueta funcional para reducir las llamadas, reservar productos y mantener el
          inventario actualizado.
        </p>
        <ul>
          <li>Catálogo con 85 productos de la planilla oficial.</li>
          <li>Accesos separados para cliente, vendedor y administrador.</li>
          <li>Diseño preparado para móvil, tableta y escritorio.</li>
        </ul>
      </section>

      <section className="auth-card" aria-labelledby="login-title">
        <p className="demo-label">Acceso de demostración</p>
        <h2 id="login-title">Iniciar sesión</h2>
        <p className="muted">Selecciona un perfil para revisar sus permisos.</p>

        <div className="demo-users" aria-label="Usuarios de demostración">
          {demoUsers.map((user) => (
            <button
              key={user.role}
              className={email === user.email ? 'is-selected' : ''}
              type="button"
              onClick={() => {
                setEmail(user.email)
                setPassword(user.password)
              }}
            >
              {user.name}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button--primary button--full" type="submit">Entrar</button>
        </form>

        <p className="auth-help">Clave demo: <strong>demo123</strong></p>
        <p className="auth-help">¿Cliente nuevo? <Link to="/registro">Crear una cuenta</Link></p>
        <p className="prototype-note">
          Este acceso local permite probar la interfaz. Será reemplazado por JWT emitido por el
          microservicio de autenticación.
        </p>
      </section>
    </main>
  )
}

export default LoginPage
