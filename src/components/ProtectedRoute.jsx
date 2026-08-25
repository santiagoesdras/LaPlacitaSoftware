import { useEffect } from 'react'
import { useAuth } from './AuthProvider.jsx'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  useEffect(() => {
    if (user === null) window.location.replace('/admin/login')
  }, [user])

  if (user === undefined) {
    return <p className="estado-pagina" role="status">Verificando sesión...</p>
  }

  if (!user) {
    return <p className="estado-pagina" role="status">Redirigiendo al inicio de sesión...</p>
  }

  return children
}
