import { useAuth } from './AuthProvider.jsx'

export default function AdminHeader() {
  const { user, signOut } = useAuth()
  const pathname = window.location.pathname

  async function handleSignOut() {
    await signOut()
    window.location.replace('/admin/login')
  }

  return (
    <header className="admin-header">
      <div>
        <p className="eyebrow">Comedor La Placita</p>
        <strong>Administración del menú</strong>
      </div>

      <nav aria-label="Navegación administrativa">
        <a className={pathname === '/admin' ? 'active' : undefined} href="/admin">Inicio</a>
        <a className={pathname === '/admin/productos' ? 'active' : undefined} href="/admin/productos">Productos</a>
        <a className={pathname === '/admin/categorias' ? 'active' : undefined} href="/admin/categorias">Categorías</a>
      </nav>

      <div className="admin-sesion">
        <span>{user?.email}</span>
        <button type="button" className="boton boton--secundario" onClick={handleSignOut}>
          Salir
        </button>
      </div>
    </header>
  )
}
