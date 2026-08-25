import AdminHeader from '../components/AdminHeader.jsx'

export default function Admin() {
  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="admin-main">
        <header className="admin-page-heading">
          <p className="eyebrow">Panel principal</p>
          <h1>¿Qué deseas actualizar?</h1>
          <p>Los cambios guardados se reflejan directamente en el menú público.</p>
        </header>

        <div className="admin-card-grid">
          <article className="admin-panel">
            <h2>Productos</h2>
            <p>Crea platillos, actualiza precios, cambia fotografías y controla su disponibilidad.</p>
            <a className="boton boton--primario" href="/admin/productos">
              Administrar productos
            </a>
          </article>

          <article className="admin-panel">
            <h2>Categorías</h2>
            <p>Organiza el menú en desayunos, almuerzos, bebidas u otras secciones.</p>
            <a className="boton boton--primario" href="/admin/categorias">
              Administrar categorías
            </a>
          </article>
        </div>
      </main>
    </div>
  )
}
