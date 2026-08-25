import { useEffect, useState } from 'react'
import { getMenuImageUrl, supabase } from '../lib/supabase.js'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ProductForm({ product, onSaved, onCancel }) {
  const [nombre, setNombre] = useState(product?.nombre ?? '')
  const [precio, setPrecio] = useState(product?.precio ?? '')
  const [categoriaId, setCategoriaId] = useState(product?.categoria_id ?? '')
  const [descripcion, setDescripcion] = useState(product?.descripcion ?? '')
  const [alt, setAlt] = useState(product?.alt ?? '')
  const [orden, setOrden] = useState(product?.orden ?? 0)
  const [disponible, setDisponible] = useState(product?.disponible ?? true)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(getMenuImageUrl(product?.imagen_path))
  const [categorias, setCategorias] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    supabase
      .from('categorias')
      .select('id, nombre, activo')
      .order('orden')
      .order('nombre')
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) {
          setError('No fue posible cargar las categorías.')
        } else {
          setCategorias(data ?? [])
          if (data?.[0]) setCategoriaId((current) => current || data[0].id)
        }
        setLoadingCategories(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    setError(null)

    if (!file) {
      setImageFile(null)
      return
    }
    if (!IMAGE_TYPES.includes(file.type)) {
      setError('La fotografía debe ser JPG, PNG o WebP.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('La fotografía no puede superar 5 MB.')
      event.target.value = ''
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function uploadImage() {
    if (!imageFile) return product?.imagen_path ?? null

    const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `productos/${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(path, imageFile, { cacheControl: '3600', upsert: false })

    if (uploadError) throw new Error('No fue posible subir la fotografía.')
    return path
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!categoriaId) {
      setError('Debes crear o seleccionar una categoría.')
      return
    }

    setSaving(true)
    let uploadedPath = null

    try {
      uploadedPath = await uploadImage()
      const values = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        categoria_id: categoriaId,
        imagen_path: uploadedPath,
        alt: alt.trim(),
        orden: Number(orden) || 0,
        disponible,
        actualizado_en: new Date().toISOString(),
      }

      const query = product
        ? supabase.from('productos').update(values).eq('id', product.id)
        : supabase.from('productos').insert(values)

      const { error: saveError } = await query
      if (saveError) throw new Error('No fue posible guardar el producto.')

      if (imageFile && product?.imagen_path && product.imagen_path !== uploadedPath) {
        await supabase.storage.from('menu-images').remove([product.imagen_path])
      }

      onSaved()
    } catch (saveError) {
      if (imageFile && uploadedPath && uploadedPath !== product?.imagen_path) {
        await supabase.storage.from('menu-images').remove([uploadedPath])
      }
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="admin-panel" aria-labelledby="product-form-title">
      <h2 id="product-form-title">{product ? `Editar ${product.nombre}` : 'Nuevo producto'}</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="campo">
            <label htmlFor="product-name">Nombre</label>
            <input id="product-name" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
          </div>

          <div className="campo">
            <label htmlFor="product-price">Precio en quetzales</label>
            <input id="product-price" type="number" min="0.01" step="0.01" value={precio} onChange={(event) => setPrecio(event.target.value)} required />
          </div>

          <div className="campo">
            <label htmlFor="product-category">Categoría</label>
            <select id="product-category" value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)} disabled={loadingCategories} required>
              <option value="">Selecciona una categoría</option>
              {categorias.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}{category.activo ? '' : ' (inactiva)'}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="product-order">Orden</label>
            <input id="product-order" type="number" min="0" value={orden} onChange={(event) => setOrden(event.target.value)} />
          </div>

          <div className="campo admin-form-grid__wide">
            <label htmlFor="product-description">Descripción</label>
            <textarea id="product-description" rows="3" value={descripcion} onChange={(event) => setDescripcion(event.target.value)} required />
          </div>

          <div className="campo">
            <label htmlFor="product-image">Fotografía</label>
            <input id="product-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
            <small>JPG, PNG o WebP; máximo 5 MB.</small>
          </div>

          <div className="campo">
            <label htmlFor="product-alt">Descripción de la fotografía</label>
            <input id="product-alt" value={alt} onChange={(event) => setAlt(event.target.value)} required />
          </div>

          <label className="admin-check">
            <input type="checkbox" checked={disponible} onChange={(event) => setDisponible(event.target.checked)} />
            Disponible en el menú público
          </label>
        </div>

        {previewUrl && <img className="admin-image-preview" src={previewUrl} alt="Vista previa del producto" />}
        {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}

        <div className="admin-actions">
          {product && <button className="boton boton--secundario" type="button" onClick={onCancel} disabled={saving}>Cancelar</button>}
          <button className="boton boton--primario" type="submit" disabled={saving || loadingCategories}>
            {saving ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      </form>
    </section>
  )
}
