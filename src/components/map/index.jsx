import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

import "./style.css"; // ⬅ importa o CSS do mapa

// Corrige os ícones no build
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapSection() {
  const position = [-20.34380397737362, -40.321189971277036];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="map-leaflet"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Aqui é a sede da empresa. <br /> Visite-nos!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapSection;
