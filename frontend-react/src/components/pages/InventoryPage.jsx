import { useMemo, useState } from 'react'

function InventoryPage({ products, onAdjustStock }) {
  const [onlyAlerts, setOnlyAlerts] = useState(true)
  const displayed = useMemo(
    () => products.filter((product) => !onlyAlerts || product.stock <= product.stockMinimo),
    [products, onlyAlerts],
  )

  return (
    <section className="container section-block">
      <div className="section-heading section-heading--row">
        <div><p className="eyebrow">Operación interna</p><h1>Control de inventario</h1><p>Actualización local de la maqueta.</p></div>
        <label className="checkbox-field"><input type="checkbox" checked={onlyAlerts} onChange={(event) => setOnlyAlerts(event.target.checked)} /> Solo alertas</label>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Código</th><th>Producto</th><th>Stock</th><th>Mínimo</th><th>Estado</th></tr></thead>
          <tbody>
            {displayed.map((product) => (
              <tr key={product.codigo}>
                <td>{product.codigo}</td>
                <td><strong>{product.nombre}</strong><small>{product.marca}</small></td>
                <td><input aria-label={`Stock de ${product.nombre}`} type="number" min="0" value={product.stock} onChange={(event) => onAdjustStock(product.codigo, Number(event.target.value))} /></td>
                <td>{product.stockMinimo}</td>
                <td><span className={`status-dot ${product.stock <= product.stockMinimo ? 'status-dot--alert' : ''}`}>{product.stock <= product.stockMinimo ? 'Reponer' : 'Disponible'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default InventoryPage
