import { useState } from 'react'
import { Link } from 'react-router-dom'

function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="auth-page auth-page--single">
      <section className="auth-card" aria-labelledby="register-title">
        <Link className="back-link" to="/login">← Volver al ingreso</Link>
        <p className="demo-label">Registro público</p>
        <h1 id="register-title">Crear cuenta de cliente</h1>
        {submitted ? (
          <div className="success-message" role="status">
            <strong>Formulario validado.</strong>
            <p>En la siguiente etapa estos datos se enviarán al microservicio de autenticación.</p>
          </div>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
            <label htmlFor="name">Nombre completo</label>
            <input id="name" name="name" autoComplete="name" required />
            <label htmlFor="register-email">Correo</label>
            <input id="register-email" name="email" type="email" autoComplete="email" required />
            <label htmlFor="phone">Teléfono</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required />
            <label htmlFor="register-password">Contraseña</label>
            <input id="register-password" name="password" type="password" minLength="8" required />
            <button className="button button--primary button--full" type="submit">Validar registro</button>
          </form>
        )}
      </section>
    </main>
  )
}

export default RegisterPage
