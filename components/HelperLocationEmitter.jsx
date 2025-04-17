"use client"

import { useEffect } from "react"
import socket from "lib/socket-client"
export default function HelperLocationEmitter({ helperId }) {
  useEffect(() => {
    if (!helperId) return

    // Trigger socket server (App Router fix)
    fetch("/api/socket")

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        socket.emit("locationUpdate", {
          id: helperId,
          location: {
            lat: latitude,
            lng: longitude,
          },
        })
      },
      (error) => {
        console.error("Error watching position:", error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [helperId])

  return null // no UI needed
}
