import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom icon for the marker (optional)
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

interface LocationMapProps {
  position: [number, number]; // [latitude, longitude]
}

const LocationMap: React.FC<LocationMapProps> = ({ position }) => {

  const mapboxStyle = 'mapbox/streets-v11'; // You can change to any Mapbox style

  return (
    <div className="location-map">
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: '400px', width: '350px' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_mapboxAccessToken}`}

        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Our Clinic Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;