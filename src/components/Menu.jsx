import { useEffect, useState } from 'react'
import { getMenuImageUrl, hasSupabaseConfig, supabase } from '../lib/supabase.js'

export default function Menu() {
  const [platos, setPlatos] = useState([])
  const [categoria, setCategoria] = useState('todos')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadMenu() {
      if (!supabase || !hasSupabaseConfig()) {
        if (active) {
          setError('El menú todavía no está conectado con Supabase.')
          setCargando(false)
        }
        return
      }

      const { data, error: queryError } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          descripcion,
          precio,
          imagen_path,
          alt,
          orden,
          categoria_id,
          categorias!inner (id, nombre, activo, orden)
        `)
        .eq('disponible', true)
        .eq('categorias.activo', true)
        .order('orden')

      if (!active) return

      if (queryError) {
        setError('No fue posible cargar el menú. Intenta nuevamente más tarde.')
      } else {
        setPlatos(data ?? [])
      }
      setCargando(false)
    }

    loadMenu()

    return () => {
      active = false
    }
  }, [])

  const categorias = Array.from(
    new Map(platos.map((plato) => [plato.categorias.id, plato.categorias])).values(),
  ).sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre))

  const platosFiltrados = categoria === 'todos'
    ? platos
    : platos.filter((plato) => plato.categoria_id === categoria)

  return (
    <section id="menu" className="section" aria-labelledby="titulo-menu">
      <div className="container flow">
        <header className="section-heading">
          <p className="eyebrow">Nuestra cocina</p>
          <h2 id="titulo-menu">Menú</h2>
          <p>Explora nuestros platos y filtra el menú por categoría.</p>
        </header>

        {!cargando && !error && categorias.length > 0 && (
          <div className="filtros-menu" role="group" aria-label="Filtrar menú por categoría">
            <button
              type="button"
              aria-pressed={categoria === 'todos'}
              onClick={() => setCategoria('todos')}
            >
              Todos
            </button>
            {categorias.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={categoria === item.id}
                onClick={() => setCategoria(item.id)}
              >
                {item.nombre}
              </button>
            ))}
          </div>
        )}

        {cargando && <p role="status">Cargando menú...</p>}
        {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}

        {!cargando && !error && (
          <>
            <p className="menu-resumen" role="status">
              Mostrando {platosFiltrados.length} platos.
            </p>

            {platosFiltrados.length > 0 ? (
              <div className="menu-grid">
                {platosFiltrados.map((plato) => {
                  const imageUrl = getMenuImageUrl(plato.imagen_path)

                  return (
                    <article className="plato-card" key={plato.id}>
                      <div className="plato-card__contenido">
                        <p className="plato-card__categoria">{plato.categorias.nombre}</p>
                        <h3>{plato.nombre}</h3>
                        <p className="plato-card__precio">Q {Number(plato.precio).toFixed(2)}</p>
                        <p className="plato-card__descripcion">{plato.descripcion}</p>
                      </div>

                      <div className="plato-card__imagen">
                        {imageUrl ? (
                          <img src={imageUrl} alt={plato.alt} loading="lazy" />
                        ) : (
                          <span aria-hidden="true">Sin fotografía</span>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p>No hay platos disponibles en esta categoría.</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
