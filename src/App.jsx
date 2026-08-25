import { AuthProvider } from './components/AuthProvider.jsx'
import Contacto from './components/Contacto.jsx'
import Menu from './components/Menu.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Admin from './pages/Admin.jsx'
import AdminCategories from './pages/AdminCategories.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import Login from './pages/Login.jsx'

function LandingPage() {
  return (
    <>
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido principal
      </a>

      <header className="site-header">
        <div className="container site-header__content">
          <a className="site-brand" href="#inicio" aria-label="La Placita, inicio">
            La Placita
          </a>

          <nav aria-label="Navegación principal">
            <ul className="site-nav">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#menu">Menú</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="contenido-principal">
        <section id="inicio" className="section hero" aria-labelledby="titulo-principal">
          <div className="container hero__grid">
            <div className="flow">
              <p className="eyebrow">Comedor La Placita</p>
              <h1 id="titulo-principal">Comida chapina de casa, servida como en casa</h1>
              <p className="lead">
                Desayunos desde las 6 de la mañana, almuerzo del día y refacciones.
                Mirá el menú actualizado y apartá tu mesa en un minuto.
              </p>

              <div className="hero-acciones">
                <a className="boton boton--primario" href="#menu">Ver el menú</a>
                <a className="boton boton--secundario" href="#contacto">Reservar mesa</a>
              </div>

              <p className="hero-dato">
                Abierto de lunes a sábado, de 6:00 a. m. a 7:00 p. m.
              </p>
            </div>

            <img
              className="hero__imagen"
              src="/images/menu/desayuno-chapin.jpg"
              alt=""
              width="800"
              height="600"
            />
          </div>
        </section>

        <Menu />
        <Contacto />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p><small>© {new Date().getFullYear()} Comedor La Placita.</small></p>
        </div>
      </footer>
    </>
  )
}

function AdminRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const pages = {
    '/': <LandingPage />,
    '/admin/login': <Login />,
    '/admin': <AdminRoute><Admin /></AdminRoute>,
    '/admin/productos': <AdminRoute><AdminProducts /></AdminRoute>,
    '/admin/categorias': <AdminRoute><AdminCategories /></AdminRoute>,
  }

  return (
    <AuthProvider>
      {pages[pathname] ?? <LandingPage />}
    </AuthProvider>
  )
}
