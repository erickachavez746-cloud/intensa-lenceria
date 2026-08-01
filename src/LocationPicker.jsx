import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Arreglo necesario: los empaquetadores (Vite/Webpack) rompen las rutas
// por defecto de los íconos de Leaflet si no se configuran manualmente.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SANTA_CRUZ = { lat: -17.7833, lng: -63.1821 };

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange }) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const center = value || SANTA_CRUZ;

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta ubicación GPS.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError('No se pudo obtener tu ubicación. Revisa los permisos, o marca el punto en el mapa manualmente.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className="w-full text-xs font-semibold px-3 py-2 rounded-lg mb-2 disabled:opacity-50"
        style={{ background: '#4A2E1A', color: '#FBF7F1' }}
      >
        {locating ? 'Buscando tu ubicación...' : '📍 Usar mi ubicación GPS'}
      </button>
      {error && <p className="text-[11px] mb-2" style={{ color: '#B4423C' }}>{error}</p>}
      <div style={{ height: 180, borderRadius: 10, overflow: 'hidden', border: '1px solid #DDCBB4' }}>
        <MapContainer center={[center.lat, center.lng]} zoom={value ? 15 : 12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onChange} />
          {value && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>
      <p className="text-[11px] opacity-60 mt-1">Toca el mapa para ajustar el punto exacto de entrega.</p>
    </div>
  );
}
