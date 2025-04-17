"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useState } from "react"
import socket from "lib/socket-client"
import Router from "next/router"
import { useRouter } from "next/navigation"

// Fix default icon issues in Next.js (for Leaflet)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})


const helperIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom icon for helper
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

const userIcon = new L.Icon({
  iconUrl: "https://i.pinimg.com/474x/b3/c7/02/b3c7023d4660075b40834e720885186b.jpg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

export default function MapComponent({ userLat, userLon, helpers, selectedHelperId }) {
  const center = [userLat, userLon]
  const [helperLocation, setHelperLocation] = useState(null)

  useEffect(() => {
    // Trigger socket server init (important for App Router)

    if (!selectedHelperId) return

    // Listen to real-time updates
    socket.on("locationUpdate", (data) => {
      if (data.id === selectedHelperId) {
        setHelperLocation(data.location)
      }
    })

    return () => {
      socket.off("locationUpdate")
    }
  }, [selectedHelperId])


  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });
  
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });
  
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  
  return (
    <div className="w-full h-[300px] sm:h-[400px] mb-6 rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Static Helper Markers */}
        {helpers.map((helper, index) => {
          const [lon, lat] = helper.location.coordinates
          return (
            <Marker key={index} position={[lat, lon]} icon={helperIcon}>
              <Popup>
                <div>
                  <strong>{helper.name}</strong>
                  <br />
                  {helper.serviceType}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Live Tracking of Selected Helper */}
        {helperLocation && (
          <Marker position={[helperLocation.lat, helperLocation.lng]} icon={helperIcon}>
            <Popup>📍 Tracking booked helper</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
