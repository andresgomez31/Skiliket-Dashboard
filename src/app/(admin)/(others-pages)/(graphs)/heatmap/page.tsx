"use client";

import { useEffect, useState } from "react";
import HeatMap from "@/components/maps/HeatMap";
import { useSupabase } from "@/context/SupabaseContext";

type LocationRow = {
  node: number;
  location: string;
};

type CrowdAggRow = {
  node: number;
  avg: number;
};

export default function HeatMapPage() {
  const supabase = useSupabase();
  const [schema, setSchema] = useState<"simulation" | "public">("simulation");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [hour, setHour] = useState<string>("12");

  const [points, setPoints] = useState<
    { lat: number; lon: number; intensity: number }[]
  >([]);

  useEffect(() => {
    async function load() {
      if (!supabase) return;

      // 1. Locations
      const { data: locs, error: lerr } = await supabase
        .schema(schema)
        .from("locations")
        .select("node, location");

      if (lerr) {
        console.error(lerr);
        return;
      }

      // 2. Average crowd_index per node
      const { data: crowd, error: cerr } = await supabase
        .schema(schema)
        .from("crowd_index")
        .select("node, avg:crowd_index")
        .lte("measured_at", `${date} ${hour}:59:59`)
        .gte("measured_at", `${date} ${hour}:00:00`);

      if (cerr) {
        console.error(cerr);
        return;
      }

      // 3. Max for normalization
      const { data: maxCrowdData, error: maxErr } = await supabase
        .schema(schema)
        .from("crowd_index")
        .select("crowd_index")
        .order("crowd_index", { ascending: false })
        .limit(1);

      if (maxErr) {
        console.error(maxErr);
        return;
      }

      const { data: minCrowdData, error: minErr } = await supabase
        .schema(schema)
        .from("crowd_index")
        .select("crowd_index")
        .order("crowd_index", { ascending: true })
        .limit(1);

      if (minErr) {
        console.error(minErr);
        return;
      }

      const minVal = minCrowdData?.[0]?.crowd_index || 0;
      const maxVal = maxCrowdData?.[0]?.crowd_index || 1;

      // 4. Join
      const joined = locs
        .map((l: LocationRow) => {
          const agg = (crowd as CrowdAggRow[]).find((c) => c.node === l.node);
          if (!agg) return null;

          const [latS, lonS] = l.location.replace("(", "").replace(")", "").split(",");
          const lat = parseFloat(latS);
          const lon = parseFloat(lonS);

          const intensity = (agg.avg - minVal) / (maxVal - minVal); // normalize between 0 and 1

          return { lat, lon, intensity };
        })
        .filter(Boolean) as { lat: number; lon: number; intensity: number }[];

      setPoints(joined);
    }

    load();
  }, [supabase, schema, date, hour]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-2 bg-neutral-900 text-white flex gap-2 items-center">
        <span className="font-semibold">Schema:</span>

        <button
          onClick={() => setSchema("simulation")}
          className={`px-3 py-1 rounded ${
            schema === "simulation" ? "bg-blue-600" : "bg-neutral-700"
          }`}
        >
          simulation
        </button>

        <button
          onClick={() => setSchema("public")}
          className={`px-3 py-1 rounded ${
            schema === "public" ? "bg-blue-600" : "bg-neutral-700"
          }`}
        >
          public
        </button>

        <span className="ml-4 font-semibold">Date:</span>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-700"
        />

        <input
          type="number"
          min="0"
          max="23"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="w-16 px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-700"
        />

        <button
          onClick={() => setDate(new Date().toISOString().split("T")[0])}
          className="px-3 py-1 rounded bg-green-600"
        >
          Today
        </button>

        <button
          onClick={() => setHour("12")}
          className="px-3 py-1 rounded bg-green-600"
        >
          Noon
        </button>
      </div>

      <div className="flex-1">
        <HeatMap points={points} />
      </div>
    </div>
  );
}
