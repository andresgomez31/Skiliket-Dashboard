"use client";

import React, { useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import LineChart from "@/components/charts/line/LineChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";

export default function SensDataPage() {
  const supabase = useSupabase();

  // =======================
  // UI STATE
  // =======================
  const [schema, setSchema] = useState<"public" | "simulation">("simulation");
  const [nodes, setNodes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [measures, setMeasures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterNode, setFilterNode] = useState<number | "all">("all");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const paginated = measures.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(measures.length / pageSize);

  // Chart tabs
  const [tab, setTab] = useState<"humidity" | "co2" | "noise" | "uv">(
    "humidity"
  );

  // =======================
  // Fetch function
  // =======================
  async function fetchData() {
    setLoading(true);

    const s = supabase.schema(schema);

    // Build filters
    let query = s.from("measures").select("*");

    if (fromDate) query = query.gte("measured_at", fromDate);
    if (toDate) query = query.lte("measured_at", toDate);
    if (filterNode !== "all") query = query.eq("node", filterNode);

    const [nodesRes, locRes, measRes] = await Promise.all([
      s.from("nodes").select("*"),
      s.from("locations").select("*"),
      query,
    ]);

    setNodes(nodesRes.data ?? []);
    setLocations(locRes.data ?? []);
    setMeasures(measRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [schema, fromDate, toDate, filterNode]);

  if (loading) return <p>Loading...</p>;

  // =========================
  // CHART TRANSFORMATIONS
  // =========================
  const xValues = [...new Set(measures.map((m) => m.measured_at))];
  const nodesById = [...new Set(measures.map((m) => m.node))];

  function seriesFor(field: "humidity" | "co2" | "noise" | "uv") {
    return nodesById.map((nodeId) => {
      const nodeMeasures = measures.filter((m) => m.node === nodeId);
      return {
        name: `Node ${nodeId}`,
        data: xValues.map((t) => {
          const row = nodeMeasures.find((m) => m.measured_at === t);
          return row ? row[field] : null;
        }),
      };
    });
  }

  return (
    <div className="space-y-10">

      {/* ======================== */}
      {/* CONTROLS */}
      {/* ======================== */}
      <section className="flex flex-col gap-4 p-4 rounded border bg-white">

        {/* Schema toggle */}
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

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <label>From:</label>
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <label>To:</label>
          <input
            type="datetime-local"
            className="border p-2 rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <label>Node:</label>
          <select
            className="border p-2 rounded"
            value={filterNode}
            onChange={(e) =>
              setFilterNode(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
          >
            <option value="all">All</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                Node {n.id}
              </option>
            ))}
          </select>

          <button
            onClick={fetchData}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Apply
          </button>
        </div>
      </section>

      {/* ====================== */}
      {/* TABLE 1: Nodes          */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Nodes</h2>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Deleted</th>
            </tr>
          </thead>

          <tbody>
            {nodes.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="p-2">{n.id}</td>
                <td className="p-2">{n.name}</td>
                <td className="p-2">{n.deleted_at ?? "Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ====================== */}
      {/* TABLE 2: Locations      */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Current Locations</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <p className="font-medium">Node {loc.node}</p>
              <p>Point: ({loc.location.x}, {loc.location.y})</p>
              <p className="text-xs text-gray-500">From: {loc.from_dt}</p>
              <p className="text-xs text-gray-500">To: {loc.to_dt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== */}
      {/* TABLE 3: Raw Measures   */}
      {/* ====================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Sensor Measures (Paginated)</h2>

        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Node</th>
              <th className="p-2">Humidity</th>
              <th className="p-2">CO₂</th>
              <th className="p-2">Noise</th>
              <th className="p-2">UV</th>
              <th className="p-2">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((m, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{m.node}</td>
                <td className="p-2">{m.humidity}</td>
                <td className="p-2">{m.co2}</td>
                <td className="p-2">{m.noise}</td>
                <td className="p-2">{m.uv}</td>
                <td className="p-2">{m.measured_at}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">Page {page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      {/* ========================= */}
      {/* TABS FOR SENSOR CHARTS   */}
      {/* ========================= */}
      <section>
        <div className="flex gap-4 border-b pb-2 mb-4">
          {(["humidity", "co2", "noise", "uv"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 ${
                tab === key
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "humidity" && (
          <LineChart
            title="Humidity Over Time"
            xLabel="Timestamp"
            yLabel="%"
            xValues={xValues}
            ySeries={seriesFor("humidity")}
          />
        )}

        {tab === "co2" && (
          <LineChart
            title="CO₂ Levels Over Time"
            xLabel="Timestamp"
            yLabel="ppm"
            xValues={xValues}
            ySeries={seriesFor("co2")}
          />
        )}

        {tab === "noise" && (
          <LineChart
            title="Noise Levels Over Time"
            xLabel="Timestamp"
            yLabel="dB"
            xValues={xValues}
            ySeries={seriesFor("noise")}
          />
        )}

        {tab === "uv" && (
          <LineChart
            title="UV Index Over Time"
            xLabel="Timestamp"
            yLabel="UV"
            xValues={xValues}
            ySeries={seriesFor("uv")}
          />
        )}
      </section>

      {/* ====================== */}
      {/* BAR CHART             */}
      {/* ====================== */}
      <BarChartOne
        title="Measurements per Node"
        xLabel="Node"
        yLabel="Count"
        xValues={nodesById.map((n) => `Node ${n}`)}
        ySeries={[
          {
            name: "Measures",
            data: nodesById.map(
              (id) => measures.filter((m) => m.node === id).length
            ),
          },
        ]}
      />

    </div>
  );
}
