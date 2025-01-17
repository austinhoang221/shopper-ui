import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { reverseGeocode } from "@/app/api/services/externalApiService";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapComponentProps {
  onPlaceSelect: (place: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onPlaceSelect }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.6297, 10.8231],
      zoom: 12,
    });

    // marker.current = new mapboxgl.Marker()
    //   .setLngLat([106.6297, 10.8231])
    //   .addTo(map.current);

    map.current.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      try {
        const result = await reverseGeocode(lng, lat);
        const placeName = result?.name || "No place found";
        onPlaceSelect(placeName.toString());
      } catch (error) {
        console.error("Error fetching reverse geocode:", error);
      }
    });
  }, [onPlaceSelect]);

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default MapComponent;
