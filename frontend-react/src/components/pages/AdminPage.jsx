import { useState } from 'react'
import { formatCurrency } from '../../utils/formatters.js'

const emptyForm = { codigo: '', nombre: '', categoria: 'Herramientas', subcategoria: 'General', marca: '', unidad: 'Unidad', precioVenta: '', stock: '', stockMinimo: '5' }

function AdminPage({ products, orders, onCreateProduct, onUpdateProduct, onDeleteProduct }) {
  const [form, setForm] = useState(emptyForm)
  const [editingCode, setEditingCode] = useState(null)
  const [message, setMessage] = useState('')
  const lowStock = products.filter((product) => product.stock <= product.stockMinimo).length
  const pendingOrders = orders.filter((order) => order.estado !== 'ENTREGADO').length

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    try {
      if (editingCode) onUpdateProduct(editingCode, form)
      else onCreateProduct(form)
      setMessage(editingCode ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.')
      setForm(emptyForm)
      setEditingCode(null)
    } catch (error) {
      setMessage(error.message)
    }
  }
  const edit = (product) => {
    setEditingCode(product.codigo)
    setForm({ ...emptyForm, ...product })
    setMessage('')
  }

  return (
    <section className="container section-block">
      <div className="section-heading"><p className="eyebrow">Solo administrador</p><h1>Panel de administración</h1><p>CRUD local de productos con persistencia para la evaluación React.</p></div>
      <div className="metric-grid">
        <article><span>Productos</span><strong>{products.length}</strong><p>referencias de muestra</p></article>
        <article><span>Alertas</span><strong>{lowStock}</strong><p>productos por reponer</p></article>
        <article><span>Pedidos</span><strong>{pendingOrders}</strong><p>pendientes en la maqueta</p></article>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-4">
          <form className="card border-0 shadow-sm h-100" onSubmit={submit}>
            <div className="card-body p-4">
              <h2 className="h4">{editingCode ? `Editar ${editingCode}` : 'Nuevo producto'}</h2>
              {message && <p className="alert alert-info py-2" role="status">{message}</p>}
              <label className="form-label" htmlFor="admin-codigo">Código</label><input className="form-control mb-3" id="admin-codigo" name="codigo" value={form.codigo} onChange={change} disabled={Boolean(editingCode)} required />
              <label className="form-label" htmlFor="admin-nombre">Nombre</label><input className="form-control mb-3" id="admin-nombre" name="nombre" value={form.nombre} onChange={change} required />
              <label className="form-label" htmlFor="admin-categoria">Categoría</label><input className="form-control mb-3" id="admin-categoria" name="categoria" value={form.categoria} onChange={change} required />
              <label className="form-label" htmlFor="admin-marca">Marca</label><input className="form-control mb-3" id="admin-marca" name="marca" value={form.marca} onChange={change} required />
              <div className="row g-2"><div className="col-6"><label className="form-label" htmlFor="admin-precio">Precio</label><input className="form-control" id="admin-precio" name="precioVenta" type="number" min="1" value={form.precioVenta} onChange={change} required /></div><div className="col-6"><label className="form-label" htmlFor="admin-stock">Stock</label><input className="form-control" id="admin-stock" name="stock" type="number" min="0" value={form.stock} onChange={change} required /></div></div>
              <div className="d-flex gap-2 mt-4"><button className="btn btn-success flex-grow-1" type="submit">{editingCode ? 'Guardar cambios' : 'Crear producto'}</button>{editingCode && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingCode(null); setForm(emptyForm) }}>Cancelar</button>}</div>
            </div>
          </form>
        </div>
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm"><div className="card-body p-0"><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-dark"><tr><th>Código</th><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>
            {products.slice(0, 20).map((product) => <tr key={product.codigo}><td>{product.codigo}</td><td><strong>{product.nombre}</strong><small className="d-block text-secondary">{product.categoria}</small></td><td>{formatCurrency(product.precioVenta)}</td><td>{product.stock}</td><td><div className="btn-group btn-group-sm"><button className="btn btn-outline-primary" type="button" onClick={() => edit(product)}>Editar</button><button className="btn btn-outline-danger" type="button" onClick={() => onDeleteProduct(product.codigo)}>Eliminar</button></div></td></tr>)}
          </tbody></table></div></div></div>
        </div>
      </div>
    </section>
  )
}

export default AdminPage
