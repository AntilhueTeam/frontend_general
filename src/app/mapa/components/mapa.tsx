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
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Agregar coordenadas</h2>
        <form onSubmit={handleAddPoint}>
          <div style={{ marginBottom: '10px' }}>
            <label>Nombre: </label>
            <input
              type="text"
              value={newPoint.name}
              onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Latitud: </label>
            <input
              type="number"
              step="any"
              value={newPoint.lat}
              onChange={(e) => setNewPoint({ ...newPoint, lat: Number(e.target.value) })}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Longitud: </label>
            <input
              type="number"
              step="any"
              value={newPoint.lng}
              onChange={(e) => setNewPoint({ ...newPoint, lng: Number(e.target.value) })}
              required
            />
          </div>
          <button type="submit">Agregar punto</button>
        </form>

        <h3>Puntos guardados:</h3>
        <ul>
          {points.map((point, index) => (
            <li key={index}>
              {point.name} - {point.lat}, {point.lng}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer
          center={initialPosition}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapClickHandler onMapClick={(point) => setNewPoint(point)} />
          
          {points.map((point, index) => (
            <Marker key={index} position={[point.lat, point.lng]}>
              <Popup>
                <strong>{point.name}</strong><br/>
                Lat: {point.lat}<br/>
                Lng: {point.lng}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Mapa;