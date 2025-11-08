import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Corrige os ícones no build
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapSection() {
  return (
    <div
      style={{
        height: '516px',
        width: '90%',
        maxWidth: '1200px',
        margin: '40px auto',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <MapContainer
        center={[-20.34380397737362, -40.321189971277036]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[-20.34380397737362, -40.321189971277036]}>
          <Popup>
            Aqui é a sede da empresa. <br /> Visite-nos!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapSection;
