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
  return (
    <div className="location-map">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '150px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
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
