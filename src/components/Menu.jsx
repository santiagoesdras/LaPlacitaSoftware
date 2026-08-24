// Este componente seguirá el mismo molde visto en clase:
// Zona A: estados; Zona B: useEffect + fetch; Zona C: las tres caras.
export default function Menu() {
  return (
    <section id="menu" className="section" aria-labelledby="titulo-menu">
      <div className="container flow">
        <header className="section-heading">
          <p className="eyebrow">Nuestra cocina</p>
          <h2 id="titulo-menu">Menú</h2>
          <p>
            Aquí se implementará el componente que cargará <code>menu.json</code>,
            mostrará las caras de carga, error y datos, y filtrará por categoría.
          </p>
        </header>

        <div className="placeholder" role="status">
          Componente de menú pendiente de implementación.
        </div>
      </div>
    </section>
  )
}
