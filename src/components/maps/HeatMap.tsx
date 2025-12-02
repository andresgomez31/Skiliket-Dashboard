"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { useEffect } from "react";

type HeatPoint = {
  lat: number;
  lon: number;
  intensity: number;
};

function HeatLayer({ points }: { points: HeatPoint[] }) {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    if (!map || !window.L || !window.L.heatLayer) return;

    const heatData = points.map((p) => [p.lat, p.lon, p.intensity]);

    console.log("Adding heat layer with data:", heatData);

    // @ts-ignore
    const layer = window.L.heatLayer(heatData, {
        radius: 40, // pixel radius of each point
        blur: 20,   // blur intensity
        maxZoom: 17,
        max: 1.0, // maximum point intensity
        gradient: {
            0.0: "blue",
            0.5: "lime",
            1.0: "red",
        },
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, points]);

  return null;
}

export default function HeatMap({
  points,
}: {
  points: HeatPoint[];
}) {
  return (
    <MapContainer
      center={[20.7354, -103.4554]} // neutral center
      zoom={18}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer points={points} />
    </MapContainer>
  );
}
