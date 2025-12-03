"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import LineChart from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";

type View = "global" | "node" | "hourly" | "spatial";

export default function CalcStatsPage() {
  const supabase = useSupabase();

  const [schema, setSchema] = useState<"public" | "simulation">("simulation");
  const [view, setView] = useState<View>("global");

  const [dailyNode, setDailyNode] = useState<any[]>([]);
  const [dailyGlobal, setDailyGlobal] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [spatial, setSpatial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const pageSize = 20;
  const [pageGlobal, setPageGlobal] = useState(1);
  const [pageNode, setPageNode] = useState(1);

  // -------- HOURLY PAGINATION ----------
  const pageSizeHourly = 48; // ~2 days of hourly buckets
  const [pageHourly, setPageHourly] = useState(1);
  const [chart, setChart] = useState<"co2" | "noise" | "humidity" | "uv">("co2");

  // ---------------- PAGINATED FETCHES ----------------
  async function fetchGlobalPage() {
    const s = supabase.schema(schema);
    const from = (pageGlobal - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await s
      .from("daily_global_stats")
      .select("*")
      .order("day", { ascending: true })
      .range(from, to);

    if (!error) setDailyGlobal(data || []);
  }

  async function fetchNodePage() {
    const s = supabase.schema(schema);
    const from = (pageNode - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await s
      .from("daily_node_stats")
      .select("*")
      .order("node", { ascending: true })
      .range(from, to);

    if (!error) setDailyNode(data || []);
  }

  // ---------------- NON-PAGINATED FETCHES ----------------
  async function fetchStaticStats() {
    const s = supabase.schema(schema);

    const [hrRes, spRes] = await Promise.all([
      s.from("hourly_smoothed").select("*"),
      s.from("spatial_avg").select("*"),
    ]);

    setHourly(hrRes.data ?? []);
    setSpatial(spRes.data ?? []);
  }

  // On schema change
  useEffect(() => {
    (async () => {
      setLoading(true);
      setPageGlobal(1);
      setPageNode(1);
      setPageHourly(1);

      await fetchStaticStats();
      await fetchGlobalPage();
      await fetchNodePage();

      setLoading(false);
    })();
  }, [schema]);

  useEffect(() => {
    fetchGlobalPage();
  }, [pageGlobal]);

  useEffect(() => {
    fetchNodePage();
  }, [pageNode]);

  if (loading) return <p>Loading calculated data...</p>;

  // ---------------- HOURLY PAGINATED SLICE ----------------
  const fromHr = (pageHourly - 1) * pageSizeHourly;
  const toHr = fromHr + pageSizeHourly;
  const hourlyPage = hourly.slice(fromHr, toHr);

  const xHourly = hourlyPage.map((h) => h.bucket);
  const hrSeries = (
    field: "avg_co2" | "avg_noise" | "avg_humidity" | "avg_uv"
  ) => [
    { name: field.toUpperCase(), data: hourlyPage.map((h) => h[field]) },
  ];

  const spatialNodes = spatial.map((s) => s.node);
  const spatialCo2 = spatial.map((s) => s.avg_co2);

  // =========================================================
  // COMPONENTS FOR EACH VIEW (lazy-rendered)
  // =========================================================

  const renderGlobalTable = () => (
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
          {dailyGlobal.map((row, i) => (
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

      <Pagination page={pageGlobal} setPage={setPageGlobal} />
    </section>
  );

  const renderNodeTable = () => (
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
          {dailyNode.map((row, i) => (
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

      <Pagination page={pageNode} setPage={setPageNode} />
    </section>
  );

  const renderHourlyCharts = () => {
    const charts = {
      co2: (
        <LineChart
          title="CO₂ Trend"
          xLabel="Hour"
          yLabel="ppm"
          xValues={xHourly}
          ySeries={hrSeries("avg_co2")}
        />
      ),
      noise: (
        <LineChart
          title="Noise Trend"
          xLabel="Hour"
          yLabel="dB"
          xValues={xHourly}
          ySeries={hrSeries("avg_noise")}
        />
      ),
      humidity: (
        <LineChart
          title="Humidity Trend"
          xLabel="Hour"
          yLabel="%"
          xValues={xHourly}
          ySeries={hrSeries("avg_humidity")}
        />
      ),
      uv: (
        <LineChart
          title="UV Trend"
          xLabel="Hour"
          yLabel="Index"
          xValues={xHourly}
          ySeries={hrSeries("avg_uv")}
        />
      ),
    };

    return (
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Hourly Smoothed Trends</h2>

        {/* --------- CHART SELECTOR --------- */}
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 border rounded" onClick={() => setChart("co2")}>
            CO₂
          </button>
          <button className="px-3 py-1 border rounded" onClick={() => setChart("noise")}>
            Noise
          </button>
          <button className="px-3 py-1 border rounded" onClick={() => setChart("humidity")}>
            Humidity
          </button>
          <button className="px-3 py-1 border rounded" onClick={() => setChart("uv")}>
            UV
          </button>
        </div>

        {/* --------- CHART --------- */}
        {charts[chart]}

        {/* --------- HOURLY PAGINATION --------- */}
        <Pagination page={pageHourly} setPage={setPageHourly} />
      </section>
    );
  };

  const renderSpatial = () => (
    <section>
      <h2 className="text-xl font-semibold mb-4">Spatial Environmental Averages</h2>

      <BarChartOne
        title="Avg CO₂ by Node"
        xLabel="Node"
        yLabel="ppm"
        xValues={spatialNodes.map((n) => `Node ${n}`)}
        ySeries={[{ name: "Avg CO₂", data: spatialCo2 }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {spatial.map((s, i) => (
          <div key={i} className="p-4 rounded-lg border bg-white shadow-sm">
            <p className="font-medium">Node {s.node}</p>
            <p className="text-sm">
              Location: ({s.lon.toFixed(5)}, {s.lat.toFixed(5)})
            </p>
            <p className="text-xs text-gray-500">Avg CO₂: {s.avg_co2.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Avg Noise: {s.avg_noise.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Avg Humidity: {s.avg_humidity.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Avg UV: {s.avg_uv.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      {/* ---------------- CONTROLS ---------------- */}
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

        {/* VIEW BUTTONS */}
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 border rounded" onClick={() => setView("global")}>
            Global Stats
          </button>
          <button className="px-3 py-1 border rounded" onClick={() => setView("node")}>
            Node Stats
          </button>
          <button className="px-3 py-1 border rounded" onClick={() => setView("hourly")}>
            Hourly Trends
          </button>
          <button className="px-3 py-1 border rounded" onClick={() => setView("spatial")}>
            Spatial Averages
          </button>
        </div>
      </section>

      {/* ---------------- ACTIVE VIEW ---------------- */}
      {view === "global" && renderGlobalTable()}
      {view === "node" && renderNodeTable()}
      {view === "hourly" && renderHourlyCharts()}
      {view === "spatial" && renderSpatial()}
    </div>
  );
}

/* ------------------------------------------ */
/* PAGINATION COMPONENT                        */
/* ------------------------------------------ */
function Pagination({
  page,
  setPage,
}: {
  page: number;
  setPage: (v: number) => void;
}) {
  return (
    <div className="flex gap-3 mt-3">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <button onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">
        Next
      </button>
    </div>
  );
}
