import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MAPBOX_ACCESS_TOKEN=process.env.MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.6297, 10.8231],
      zoom: 12,
    });

    new mapboxgl.Marker().setLngLat([106.6297, 10.8231]).addTo(map.current);

    map.current.on("click", (e) => {
      console.log(`Clicked at: ${e.lngLat.lng}, ${e.lngLat.lat}`);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return <div ref={mapContainer} className="h-96 w-full" />;
};

export default MapComponent;
