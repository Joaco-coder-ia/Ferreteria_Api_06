import { Link } from 'react-router-dom'

function NotFoundPage({ session }) {
  return (
    <main className="not-found">
      <p className="eyebrow">Error 404</p>
      <h1>Página no encontrada</h1>
      <Link className="button button--primary" to={session ? '/' : '/login'}>Volver al inicio</Link>
    </main>
  )
}

export default NotFoundPage
