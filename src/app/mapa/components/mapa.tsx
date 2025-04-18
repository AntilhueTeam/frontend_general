import dynamic from 'next/dynamic';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de los marcadores
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Point {
  lat: number;
  lng: number;
  name: string;
}

const MapClickHandler = ({ onMapClick }: { onMapClick: (point: Point) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: `Punto ${Math.floor(Math.random() * 100)}`
      });
    },
  });
  return null;
};

const Mapa = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [newPoint, setNewPoint] = useState<Point>({ lat: 0, lng: 0, name: '' });

  const initialPosition: [number, number] = [-41.463565, -73.019608];

  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPoint.lat && newPoint.lng) {
      setPoints([...points, newPoint]);
      setNewPoint({ lat: 0, lng: 0, name: '' });
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      {/* Sección superior - Lista y formulario */}
      <div style={{ 
        flex: '0 0 40%',
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '1.5rem'
        }}>
          📍 Puntos de interés
        </h2>
        
        <form onSubmit={handleAddPoint} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px',
              color: '#34495e',
              fontWeight: '500'
            }}>
              Nombre del punto
            </label>
            <input
              type="text"
              value={newPoint.name}
              onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #bdc3c7',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Ej: Mi casa"
            />
          </div>
          
          <div style={{ 
            display: 'flex',
            gap: '10px',
            marginBottom: '12px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                color: '#34495e',
                fontWeight: '500'
              }}>
                Latitud
              </label>
              <input
                type="number"
                step="any"
                value={newPoint.lat}
                onChange={(e) => setNewPoint({ ...newPoint, lat: Number(e.target.value) })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #bdc3c7',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Ej: -41.4635"
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '4px',
                color: '#34495e',
                fontWeight: '500'
              }}>
                Longitud
              </label>
              <input
                type="number"
                step="any"
                value={newPoint.lng}
                onChange={(e) => setNewPoint({ ...newPoint, lng: Number(e.target.value) })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #bdc3c7',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Ej: -73.0196"
              />
            </div>
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2980b9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3498db')}
          >
            Añadir punto
          </button>
        </form>

        <h3 style={{ 
          color: '#2c3e50',
          marginBottom: '12px',
          fontSize: '1.2rem'
        }}>
          📌 Puntos guardados
        </h3>
        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {points.map((point, index) => (
            <li key={index} style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontWeight: '500', color: '#2c3e50' }}>{point.name}</span>
              <div style={{ color: '#7f8c8d', fontSize: '0.9em' }}>
                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección inferior - Mapa */}
      <div style={{ 
        flex: '1',
        height: '60%',
        position: 'relative',
        backgroundColor: '#eaecee'
      }}>
        <MapContainer
          center={initialPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          //tap={false} // Mejor compatibilidad táctil
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={(point) => setNewPoint(point)} />
          {points.map((point, index) => (
            <Marker key={index} position={[point.lat, point.lng]}>
              <Popup>
                <div style={{ minWidth: '150px' }}>
                  <strong style={{ fontSize: '14px' }}>{point.name}</strong><br />
                  <span style={{ fontSize: '12px' }}>
                    Lat: {point.lat.toFixed(4)}<br />
                    Lng: {point.lng.toFixed(4)}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Mapa), { ssr: false });