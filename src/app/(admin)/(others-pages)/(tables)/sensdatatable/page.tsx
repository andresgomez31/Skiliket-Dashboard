"use client";

import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { saveAs } from "file-saver";
import { useSupabase } from "@/context/SupabaseContext";

export default function SensorDataPage() {
  const supabase = useSupabase();

  // -----------------------------
  // MAIN STATE
  // -----------------------------
  const [schema, setSchema] = useState<"public" | "simulation">("simulation");

  const [nodes, setNodes] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [measures, setMeasures] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // Filters
  const [filterNode, setFilterNode] = useState<number | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Reset section when schema changes
  useEffect(() => {
    setNodes([]);
    setLocations([]);
    setMeasures([]);
    loadNodesAndLocations();
  }, [schema]);

  // ============================================================
  // LOAD NODES + LOCATIONS
  // ============================================================
  async function loadNodesAndLocations() {
    const s = supabase.schema(schema);

    const [nodesRes, locRes] = await Promise.all([
      s.from("nodes").select("*"),
      s.from("locations").select("*"),
    ]);

    setNodes(nodesRes.data ?? []);
    setLocations(locRes.data ?? []);
  }

  // ============================================================
  // FILTERED MEASURES QUERY
  // ============================================================
  async function fetchData() {
    setLoading(true);

    const s = supabase.schema(schema);
    let query = s.from("measures").select("*");

    if (fromDate) query = query.gte("measured_at", fromDate);
    if (toDate) query = query.lte("measured_at", toDate);
    if (filterNode !== "all") query = query.eq("node", filterNode);

    const measRes = await query;

    setMeasures(measRes.data ?? []);
    setLoading(false);
  }

  // ============================================================
  // EXPORT CSV
  // ============================================================
  const exportCSV = () => {
    if (!measures.length) return;

    const header = Object.keys(measures[0]);
    const csv = [
      header.join(","),
      ...measures.map((r) =>
        header.map((h) => JSON.stringify(r[h] ?? "")).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `measures_export.csv`);
  };

  // ============================================================
  // TABLE CONFIG
  // ============================================================
  const columns = [
    { label: "Node", width: "min-w-[80px]" },
    { label: "Humidity", width: "w-32" },
    { label: "CO₂", width: "w-32" },
    { label: "Noise", width: "w-32" },
    { label: "UV", width: "w-32" },
    { label: "Measured At", width: "min-w-[200px]" },
  ];

  const tableRows = measures.map((m) => [
    m.node,
    m.humidity,
    m.co2,
    m.noise,
    m.uv,
    m.measured_at,
  ]);

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Sensor Data Explorer" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CONTROLS */}
        <ComponentCard className="md:col-span-1" title="Filters & Schema">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Schema</h3>
                <p className="text-xs text-gray-500">Choose datasource</p>
              </div>
              <select
                className="border rounded p-2 bg-white text-sm"
                value={schema}
                onChange={(e) => setSchema(e.target.value as any)}
              >
                <option value="public">public</option>
                <option value="simulation">simulation</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm font-medium">From</label>
              <input
                type="datetime-local"
                className="w-full border rounded p-2 text-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <label className="text-sm font-medium">To</label>
              <input
                type="datetime-local"
                className="w-full border rounded p-2 text-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />

              <label className="text-sm font-medium">Node</label>
              <select
                className="w-full border rounded p-2 text-sm"
                value={filterNode}
                onChange={(e) =>
                  setFilterNode(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
              >
                <option value="all">All nodes</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Node {n.id} — {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 justify-between pt-2">
              <button
                onClick={fetchData}
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 transition text-sm"
              >
                Apply Filters
              </button>

              <button
                disabled={!measures.length}
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export CSV
              </button>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              <div>Nodes: <span className="font-medium text-gray-700">{nodes.length}</span></div>
              <div>Locations: <span className="font-medium text-gray-700">{locations.length}</span></div>
              <div>Measurements: <span className="font-medium text-gray-700">{measures.length}</span></div>
            </div>
          </div>
        </ComponentCard>

        {/* TABLE */}
        <div className="md:col-span-2 space-y-6">
          <ComponentCard title="Measurements">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Showing</span>
                  <span className="font-semibold">{measures.length}</span>
                  <span className="text-sm text-gray-400 hidden md:inline">measurements</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Schema:</span>
                  <span className="text-sm px-2 py-1 bg-gray-100 rounded">{schema}</span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                {loading ? (
                  <div className="py-8 text-center text-gray-600">Loading...</div>
                ) : measures.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">No measurements found. Apply filters to load data.</div>
                ) : (
                  <BasicTableOne
                    columns={columns}
                    rows={tableRows}
                    rowKey={(row) => `${row[0]}-${row[5]}`}
                  />
                )}
              </div>
            </div>
          </ComponentCard>

          {/* Optional quick insights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border rounded bg-white">
              <div className="text-xs text-gray-500">Latest measurement</div>
              <div className="font-semibold text-sm mt-1">{measures[0]?.measured_at ?? "—"}</div>
            </div>
            <div className="p-4 border rounded bg-white">
              <div className="text-xs text-gray-500">Unique nodes</div>
              <div className="font-semibold text-sm mt-1">{Array.from(new Set(measures.map((m) => m.node))).length}</div>
            </div>
            <div className="p-4 border rounded bg-white">
              <div className="text-xs text-gray-500">Avg humidity</div>
              <div className="font-semibold text-sm mt-1">
                {measures.length
                  ? (
                      measures.reduce((s, m) => s + (Number(m.humidity) || 0), 0) /
                      measures.length
                    ).toFixed(1)
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
