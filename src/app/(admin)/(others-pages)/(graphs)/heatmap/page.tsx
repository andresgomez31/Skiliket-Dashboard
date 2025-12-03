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

      const start = `${date} ${hour}:00:00`;
      const end = `${date} ${hour}:59:59`;

      /* ----------------------------- 1. LOCATIONS ------------------------------ */
      const { data: locs, error: lerr } = await supabase
        .schema(schema)
        .from("locations")
        .select("node, location");

      if (lerr) return console.error(lerr);

      /* ------------------------- 2. AVG CROWD PER NODE ------------------------- */
      // build the query first and cast to any to call .group which isn't present on the typed builder
      const crowdBuilder = supabase
        .schema(schema)
        .from("crowd_index")
        .select("node, avg:avg(crowd_index)")
        .gte("measured_at", start)
        .lte("measured_at", end);

      const { data: crowdAgg, error: aerr } = await (crowdBuilder as any).group("node");

      if (aerr) return console.error(aerr);

      /* ------------------------------ 3. MIN / MAX ----------------------------- */
      const { data: minmax, error: mmErr } = await supabase
        .schema(schema)
        .from("crowd_index")
        .select("min: min(crowd_index), max: max(crowd_index)")
        .gte("measured_at", start)
        .lte("measured_at", end)
        .single();

      if (mmErr) return console.error(mmErr);

      // coerce returned values to numbers before arithmetic
      const minVal = Number(minmax?.min ?? 0);
      const maxVal = Number(minmax?.max ?? 1);
      const range = maxVal - minVal || 1;

      /* ------------------------------- 4. JOIN --------------------------------- */
      const joined = (locs as LocationRow[])
        .map((l: LocationRow) => {
          const agg = (crowdAgg as any[]).find((c) => c.node === l.node);
          if (!agg) return null;

          const [latS, lonS] = l.location.replace(/[()]/g, "").split(",");
          const lat = parseFloat(latS);
          const lon = parseFloat(lonS);

          const intensity = (Number(agg.avg) - minVal) / range;

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
