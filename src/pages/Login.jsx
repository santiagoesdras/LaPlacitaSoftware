import { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider.jsx'
import { hasSupabaseConfig } from '../lib/supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, signIn } = useAuth()

  useEffect(() => {
    if (user) window.location.replace('/admin')
  }, [user])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await signIn(email.trim(), password)

    if (signInError) {
      setError('No fue posible iniciar sesión. Verifica el correo y la contraseña.')
      setLoading(false)
      return
    }

    window.location.replace('/admin')
  }

  return (
    <main className="admin-login">
      <section className="admin-panel admin-login__panel" aria-labelledby="login-title">
        <p className="eyebrow">Comedor La Placita</p>
        <h1 id="login-title">Administración del menú</h1>
        <p>Acceso exclusivo para el propietario del comedor.</p>

        {!hasSupabaseConfig() && (
          <p className="mensaje mensaje--error" role="alert">
            Falta configurar Supabase en el archivo <code>.env.local</code>.
          </p>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="admin-email">Correo electrónico</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}

          <button className="boton boton--primario" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <a href="/">Volver al sitio público</a>
      </section>
    </main>
  )
}
