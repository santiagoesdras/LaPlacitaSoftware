import Contacto from './components/Contacto.jsx'
import Menu from './components/Menu.jsx'

// App compone la página. Cada funcionalidad vive en su propio componente.
export default function App() {
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
          <div className="container flow">
            <p className="eyebrow">Comedor La Placita</p>
            <h1 id="titulo-principal">Base del sitio lista para desarrollar</h1>
            <p className="lead">
              Este contenido es provisional. El equipo puede reemplazarlo durante la
              etapa de diseño sin modificar la estructura principal.
            </p>
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
