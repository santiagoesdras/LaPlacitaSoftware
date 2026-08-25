import { useEffect, useState } from 'react'
import { getMenuImageUrl, supabase } from '../lib/supabase.js'

export default function ProductList({ onEdit }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    supabase
      .from('productos')
      .select(`
        id,
        nombre,
        descripcion,
        precio,
        categoria_id,
        imagen_path,
        alt,
        disponible,
        orden,
        categorias (nombre)
      `)
      .order('orden')
      .order('nombre')
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) setError('No fue posible cargar los productos.')
        else setProducts(data ?? [])
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function toggleAvailability(product) {
    setError(null)
    const nextValue = !product.disponible
    const { error: updateError } = await supabase
      .from('productos')
      .update({ disponible: nextValue, actualizado_en: new Date().toISOString() })
      .eq('id', product.id)

    if (updateError) {
      setError('No fue posible cambiar la disponibilidad.')
      return
    }

    setProducts((current) => current.map((item) => (
      item.id === product.id ? { ...item, disponible: nextValue } : item
    )))
  }

  if (loading) return <p className="estado-pagina" role="status">Cargando productos...</p>

  return (
    <section className="admin-panel" aria-labelledby="product-list-title">
      <h2 id="product-list-title">Productos registrados</h2>
      {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}

      {products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const imageUrl = getMenuImageUrl(product.imagen_path)

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-name">
                        {imageUrl && <img src={imageUrl} alt="" loading="lazy" />}
                        <span>{product.nombre}</span>
                      </div>
                    </td>
                    <td>{product.categorias?.nombre ?? 'Sin categoría'}</td>
                    <td>Q {Number(product.precio).toFixed(2)}</td>
                    <td>
                      <span className={`admin-status ${product.disponible ? 'admin-status--active' : ''}`}>
                        {product.disponible ? 'Disponible' : 'Oculto'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" className="boton boton--secundario" onClick={() => onEdit(product)}>
                          Editar
                        </button>
                        <button type="button" className="boton boton--secundario" onClick={() => toggleAvailability(product)}>
                          {product.disponible ? 'Ocultar' : 'Mostrar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
