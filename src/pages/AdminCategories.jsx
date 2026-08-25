import { useEffect, useState } from 'react'
import AdminHeader from '../components/AdminHeader.jsx'
import { supabase } from '../lib/supabase.js'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [editing, setEditing] = useState(null)
  const [nombre, setNombre] = useState('')
  const [orden, setOrden] = useState(0)
  const [activo, setActivo] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function loadCategories() {
    setLoading(true)
    const { data, error: queryError } = await supabase
      .from('categorias')
      .select('id, nombre, activo, orden')
      .order('orden')
      .order('nombre')

    if (queryError) setError('No fue posible cargar las categorías.')
    else setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function resetForm() {
    setEditing(null)
    setNombre('')
    setOrden(0)
    setActivo(true)
    setError(null)
  }

  function handleEdit(category) {
    setEditing(category)
    setNombre(category.nombre)
    setOrden(category.orden)
    setActivo(category.activo)
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const values = {
      nombre: nombre.trim(),
      orden: Number(orden) || 0,
      activo,
      actualizado_en: new Date().toISOString(),
    }

    const query = editing
      ? supabase.from('categorias').update(values).eq('id', editing.id)
      : supabase.from('categorias').insert(values)

    const { error: saveError } = await query

    if (saveError) {
      setError(saveError.code === '23505'
        ? 'Ya existe una categoría con ese nombre.'
        : 'No fue posible guardar la categoría.')
      setSaving(false)
      return
    }

    resetForm()
    await loadCategories()
    setSaving(false)
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="admin-main">
        <header className="admin-page-heading">
          <p className="eyebrow">Organización</p>
          <h1>Categorías del menú</h1>
          <p>Las categorías inactivas y sus productos dejan de mostrarse en el sitio público.</p>
        </header>

        <section className="admin-panel" aria-labelledby="category-form-title">
          <h2 id="category-form-title">{editing ? `Editar ${editing.nombre}` : 'Nueva categoría'}</h2>
          <form className="admin-form admin-form--inline" onSubmit={handleSubmit}>
            <div className="campo">
              <label htmlFor="category-name">Nombre</label>
              <input id="category-name" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
            </div>
            <div className="campo">
              <label htmlFor="category-order">Orden</label>
              <input id="category-order" type="number" min="0" value={orden} onChange={(event) => setOrden(event.target.value)} />
            </div>
            <label className="admin-check">
              <input type="checkbox" checked={activo} onChange={(event) => setActivo(event.target.checked)} />
              Categoría activa
            </label>
            <div className="admin-actions">
              {editing && <button className="boton boton--secundario" type="button" onClick={resetForm}>Cancelar</button>}
              <button className="boton boton--primario" type="submit" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar categoría'}
              </button>
            </div>
          </form>
          {error && <p className="mensaje mensaje--error" role="alert">{error}</p>}
        </section>

        <section className="admin-panel" aria-labelledby="category-list-title">
          <h2 id="category-list-title">Categorías registradas</h2>
          {loading ? (
            <p role="status">Cargando categorías...</p>
          ) : (
            <div className="admin-category-list">
              {categories.map((category) => (
                <article key={category.id}>
                  <div>
                    <strong>{category.nombre}</strong>
                    <span>Orden {category.orden} · {category.activo ? 'Activa' : 'Inactiva'}</span>
                  </div>
                  <button type="button" className="boton boton--secundario" onClick={() => handleEdit(category)}>
                    Editar
                  </button>
                </article>
              ))}
              {categories.length === 0 && <p>No hay categorías registradas.</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
