"use client";

import { useEffect } from "react";
import socket from "lib/socket-client";

export default function HelperLocationEmitter({ helperId }) {
  useEffect(() => {
    if (!helperId || !navigator.geolocation) {
      console.warn("Geolocation is not supported or helperId is missing.");
      return;
    }

    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Start watching position
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("locationUpdate", {
          id: helperId,
          location: {
            lat: latitude,
            lng: longitude,
          },
        });
      },
      (error) => {
        console.error("Error watching position:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );

    // Cleanup on unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, [helperId]);

  return null; // No UI needed
}
