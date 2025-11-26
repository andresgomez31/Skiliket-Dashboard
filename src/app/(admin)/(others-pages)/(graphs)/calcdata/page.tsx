"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import LineChart from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";

export default function CalcStatsPage() {
  const supabase = useSupabase();

  // =======================
  // UI STATE
  // =======================
  const [schema, setSchema] = useState<"public" | "simulation">("simulation");

  const [dailyNode, setDailyNode] = useState<any[]>([]);
  const [dailyGlobal, setDailyGlobal] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [spatial, setSpatial] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

    // Pagination state
  const [pageGlobal, setPageGlobal] = useState(1);
  const [pageNode, setPageNode] = useState(1);
  const pageSize = 20; // adjust if needed

  // Paginated slices
  const globalPage = dailyGlobal.slice((pageGlobal - 1) * pageSize, pageGlobal * pageSize);
  const nodePage = dailyNode.slice((pageNode - 1) * pageSize, pageNode * pageSize);


  // =======================
  // Fetch stats
  // =======================
  async function fetchStats() {
    setLoading(true);

    const s = supabase.schema(schema);

    const [nodeRes, globalRes, hrRes, spRes] = await Promise.all([
      s.from("daily_node_stats").select("*"),
      s.from("daily_global_stats").select("*"),
      s.from("hourly_smoothed").select("*"),
      s.from("spatial_avg").select("*"),
    ]);

    setDailyNode(nodeRes.data ?? []);
    setDailyGlobal(globalRes.data ?? []);
    setHourly(hrRes.data ?? []);
    setSpatial(spRes.data ?? []);

    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
  }, [schema]);

  if (loading) return <p>Loading calculated data...</p>;

  // =========================
  // TRANSFORM FOR CHARTS
  // =========================

  const xHourly = hourly.map((h) => h.bucket);
  function hrSeries(field: "avg_co2" | "avg_noise" | "avg_humidity" | "avg_uv") {
    return [
      {
        name: field.toUpperCase(),
        data: hourly.map((h) => h[field]),
      },
    ];
  }

  // Spatial bar chart
  const spatialNodes = spatial.map((s) => s.node);
  const spatialCo2 = spatial.map((s) => s.avg_co2);

  return (
    <div className="space-y-10">

      {/* ======================== */}
      {/* CONTROLS */}
      {/* ======================== */}
      <section className="flex flex-col gap-4 p-4 rounded border bg-white">
        <div className="flex gap-4 items-center">
          <label className="font-medium">Schema:</label>
          <select
            className="border p-2 rounded"
            value={schema}
            onChange={(e) => setSchema(e.target.value as any)}
          >
            <option value="public">public</option>
            <option value="simulation">simulation</option>
          </select>
        </div>
      </section>

      {/* ====================== */}
      {/* GLOBAL DAILY STATS     */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Global Daily Statistics</h2>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Day</th>
              <th className="p-2">Avg CO₂</th>
              <th className="p-2">Avg Noise</th>
              <th className="p-2">Avg Humidity</th>
              <th className="p-2">Avg UV</th>
            </tr>
          </thead>

          <tbody>
            {globalPage.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{row.day}</td>
                <td className="p-2">{row.avg_co2.toFixed(2)}</td>
                <td className="p-2">{row.avg_noise.toFixed(2)}</td>
                <td className="p-2">{row.avg_humidity.toFixed(2)}</td>
                <td className="p-2">{row.avg_uv.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ====================== */}
      {/* DAILY NODE STATS       */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Node Daily Statistics</h2>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Node</th>
              <th className="p-2">Avg CO₂</th>
              <th className="p-2">Avg Noise</th>
              <th className="p-2">Avg Humidity</th>
              <th className="p-2">Avg UV</th>
              <th className="p-2">Samples</th>
            </tr>
          </thead>

          <tbody>
            {nodePage.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{row.node}</td>
                <td className="p-2">{row.avg_co2.toFixed(2)}</td>
                <td className="p-2">{row.avg_noise.toFixed(2)}</td>
                <td className="p-2">{row.avg_humidity.toFixed(2)}</td>
                <td className="p-2">{row.avg_uv.toFixed(2)}</td>
                <td className="p-2">{row.samples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ====================== */}
      {/* HOURLY SMOOTHED CHARTS */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Hourly Smoothed Trends</h2>

        <LineChart
          title="CO₂ Trend (Hourly Smoothed)"
          xLabel="Hour"
          yLabel="ppm"
          xValues={xHourly}
          ySeries={hrSeries("avg_co2")}
        />

        <LineChart
          title="Noise Trend (Hourly Smoothed)"
          xLabel="Hour"
          yLabel="dB"
          xValues={xHourly}
          ySeries={hrSeries("avg_noise")}
        />

        <LineChart
          title="Humidity Trend (Hourly Smoothed)"
          xLabel="Hour"
          yLabel="%"
          xValues={xHourly}
          ySeries={hrSeries("avg_humidity")}
        />

        <LineChart
          title="UV Trend (Hourly Smoothed)"
          xLabel="Hour"
          yLabel="Index"
          xValues={xHourly}
          ySeries={hrSeries("avg_uv")}
        />
      </section>

      {/* ====================== */}
      {/* SPATIAL AVERAGE        */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Spatial Environmental Averages</h2>

        <BarChartOne
          title="Avg CO₂ by Node Location"
          xLabel="Node"
          yLabel="ppm"
          xValues={spatialNodes.map((n) => `Node ${n}`)}
          ySeries={[
            {
              name: "Avg CO₂",
              data: spatialCo2,
            },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {spatial.map((s, i) => (
            <div key={i} className="p-4 rounded-lg border bg-white shadow-sm">
              <p className="font-medium">Node {s.node}</p>
              <p className="text-sm">
                Location: ({s.lon.toFixed(5)}, {s.lat.toFixed(5)})
              </p>
              <p className="text-xs text-gray-500">
                Avg CO₂: {s.avg_co2.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Avg Noise: {s.avg_noise.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Avg Humidity: {s.avg_humidity.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Avg UV: {s.avg_uv.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
