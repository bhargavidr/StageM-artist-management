import React from 'react'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import {Marker} from 'react-leaflet'
import {Icon} from 'leaflet'

const MapComponent = ({lat,lng}) => {

    const iconUrl = process.env.REACT_APP_PIN_URL;

  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '40vh', width: '100%' }}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} 
                icon={new Icon({iconUrl, iconSize: [32, 36]})}>
        </Marker>
    </MapContainer>
  )
}

export default MapComponent