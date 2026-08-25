import { useRef, useState } from 'react'
import AdminHeader from '../components/AdminHeader.jsx'
import ProductForm from '../components/ProductForm.jsx'
import ProductList from '../components/ProductList.jsx'

export default function AdminProducts() {
  const [editing, setEditing] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const formRef = useRef(null)

  function handleEdit(product) {
    setEditing(product)
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function handleSaved() {
    setEditing(null)
    setRefreshKey((current) => current + 1)
  }

  return (
    <div className="admin-app">
      <AdminHeader />
      <main className="admin-main">
        <header className="admin-page-heading">
          <p className="eyebrow">Catálogo</p>
          <h1>Productos del menú</h1>
          <p>Crea o edita los productos que aparecen en el sitio público.</p>
        </header>

        <div ref={formRef}>
          <ProductForm
            key={editing?.id ?? 'new'}
            product={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </div>

        <ProductList key={refreshKey} onEdit={handleEdit} />
      </main>
    </div>
  )
}
