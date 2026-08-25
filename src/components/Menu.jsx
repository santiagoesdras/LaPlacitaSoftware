import { useMenu } from "../hooks/UseMenu";

export default function Menu() {
  const { platosFiltrados, categoria, setCategoria, cargando, error } = useMenu();

  return (
    <section id="menu" className="section" aria-labelledby="titulo-menu">
      <div className="container flow">
        <header className="section-heading">
          <p className="eyebrow">Nuestra cocina</p>
          <h2 id="titulo-menu">Menú</h2>
          <p>Explora nuestros platos y filtra el menú por categoría.</p>
        </header>

        <div className="filtros-menu" aria-label="Filtrar menú por categoría">
          <button type="button" onClick={() => setCategoria("todos")}>Todos</button>
          <button type="button" onClick={() => setCategoria("desayunos")}>Desayunos</button>
          <button type="button" onClick={() => setCategoria("almuerzos")}>Almuerzos</button>
          <button type="button" onClick={() => setCategoria("bebidas")}>Bebidas</button>
        </div>

        {cargando && <p role="status">Cargando menú...</p>}
        {error && <p role="alert">{error}</p>}

        {!cargando && !error && (
          <>
            {platosFiltrados.length > 0 ? (
              <div className="menu-grid">
                {platosFiltrados.map((plato) => (
                  <article className="plato-card" key={plato.id}>
                    <div className="plato-card__contenido">
                      <h3>{plato.nombre}</h3>
                      <p className="plato-card__precio">Q {Number(plato.precio).toFixed(2)}</p>
                      <p className="plato-card__descripcion">{plato.descripcion}</p>
                      {!plato.disponible && (
                        <span className="plato-card__agotado">No disponible</span>
                      )}
                    </div>
                    <div className="plato-card__imagen">
                      <img src={plato.foto} alt={plato.alt} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>No hay platos disponibles en esta categoría.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}