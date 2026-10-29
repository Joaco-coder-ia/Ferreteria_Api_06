import { Circle, CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

const storePosition = [-29.9027, -71.252]

function LocationPage() {
  return (
    <section className="container section-block">
      <div className="section-heading">
        <p className="eyebrow">Retiro y despacho</p>
        <h1>Revisa la zona de cobertura</h1>
        <p>El círculo muestra un radio demostrativo de 8 km desde el centro de La Serena.</p>
      </div>

      <div className="map-layout">
        <div className="map-card" aria-label="Mapa interactivo de cobertura">
          <MapContainer center={storePosition} zoom={12} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={storePosition} radius={8000} pathOptions={{ color: '#d66a3d', fillOpacity: 0.12 }} />
            <CircleMarker center={storePosition} radius={10} pathOptions={{ color: '#173f35', fillColor: '#f4b63e', fillOpacity: 1 }}>
              <Popup>Ubicación referencial de Ferretería Los Maestros</Popup>
            </CircleMarker>
          </MapContainer>
        </div>
        <aside className="coverage-info">
          <h2>¿Cómo funcionará?</h2>
          <ol>
            <li>El cliente ingresa la dirección de la obra.</li>
            <li>El sistema valida si está dentro del radio.</li>
            <li>El pedido muestra retiro o despacho según cobertura.</li>
          </ol>
          <div className="note-box">
            <strong>Dato pendiente</strong>
            <p>La pauta no entrega una dirección real. Antes de publicar debe reemplazarse este punto referencial.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default LocationPage
