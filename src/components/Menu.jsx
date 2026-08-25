import { useEffect, useState } from "react";

// Este componente sigue el mismo molde visto en clase:
// Zona A: estados
// Zona B: useEffect + fetch
// Zona C: carga, error y datos

export default function Menu() {
  // Zona A: estados
  const [platos, setPlatos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Zona B: cargar los datos del menú
  useEffect(() => {
    fetch("/data/menu.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el menú");
        }

        return respuesta.json();
      })
      .then((datos) => {
        setPlatos(datos);
        setCargando(false);
      })
      .catch((error) => {
        setError(error.message);
        setCargando(false);
      });
  }, []);

  // Obtener automáticamente las categorías que existen en el menú
  const categorias = [
    "todos",
    ...new Set(platos.map((plato) => plato.categoria)),
  ];

  // Filtrar los platos según la categoría seleccionada
  const platosFiltrados =
    categoria === "todos"
      ? platos
      : platos.filter((plato) => plato.categoria === categoria);

  return (
    <section
      id="menu"
      className="section"
      aria-labelledby="titulo-menu"
    >
      <div className="container flow">

        <header className="section-heading">
          <p className="eyebrow">Nuestra cocina</p>

          <h2 id="titulo-menu">
            Menú
          </h2>

          <p>
            Explora nuestros platos y filtra el menú por categoría.
          </p>
        </header>

        {/* Filtros generados automáticamente desde las categorías del menú */}
        <div
          className="filtros-menu"
          role="group"
          aria-label="Filtrar menú por categoría"
        >
          {categorias.map((cat) => (
            <button
              type="button"
              key={cat}
              aria-pressed={categoria === cat}
              onClick={() => setCategoria(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Zona C: cargando */}
        {cargando && (
          <p role="status">
            Cargando menú...
          </p>
        )}

        {/* Zona C: error */}
        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {/* Zona C: datos */}
        {!cargando && !error && (
          <>
            <p className="menu-resumen" role="status">
              Mostrando {platosFiltrados.length} platos.
            </p>

            {platosFiltrados.length > 0 ? (
              <div className="menu-grid">

                {platosFiltrados.map((plato) => (
                  <article
                    className="plato-card"
                    key={plato.id}
                  >

                    <div className="plato-card__contenido">

                      <h3>
                        {plato.nombre}
                      </h3>

                      <p className="plato-card__precio">
                        Q {Number(plato.precio).toFixed(2)}
                      </p>

                      <p className="plato-card__descripcion">
                        {plato.descripcion}
                      </p>

                      {!plato.disponible && (
                        <span className="plato-card__agotado">
                          No disponible
                        </span>
                      )}

                    </div>

                    <div className="plato-card__imagen">
                      <img
                        src={plato.foto}
                        alt={plato.alt}
                      />
                    </div>

                  </article>
                ))}

              </div>
            ) : (
              <p>
                No hay platos disponibles en esta categoría.
              </p>
            )}
          </>
        )}

      </div>
    </section>
  );
}