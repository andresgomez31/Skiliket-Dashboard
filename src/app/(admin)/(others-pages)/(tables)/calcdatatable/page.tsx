"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";

type LastSeenRow = {
  node: number;
  measured_at: string;
  // Postgres "point" comes back as an object with x and y but it can be null
  location: { x: number; y: number } | null;
};

export default function CalcDataTable() {
  const supabase = useSupabase();
  const [rows, setRows] = useState<string[][]>([]);
  const [schema, setSchema] = useState<"public" | "simulation">("public");

  // Pagination state
  const [pageIndex, setPageIndex] = useState<number>(0); // zero-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset to first page when schema or pageSize changes
    setPageIndex(0);
  }, [schema, pageSize]);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);

      try {
        const from = pageIndex * pageSize;
        const to = from + pageSize - 1;

        // Fetch paginated aggregated node stats, request exact count
        const { data: nodeStats, error: nodeErr, count } = await supabase
          .schema(schema)
          .from("daily_node_stats")
          .select("*", { count: "exact" })
          .order("node", { ascending: true })
          .range(from, to);

        if (nodeErr) {
          console.error("nodeStats error:", nodeErr);
          setError("Failed to load node stats");
          setRows([]);
          setTotalCount(null);
          setLoading(false);
          return;
        }

        setTotalCount(count ?? null);

        // --- fetch last-seen per node (RPC returns all, we will map only for current page) ---
        const { data: lastSeen, error: lastErr } = await supabase.rpc(
          `last_seen_per_node`
        );

        if (lastErr) {
          console.error("lastSeen error:", lastErr);
          // don't bail out; continue but mark absence of last seen
        }

        const lastSeenMap = new Map<number, LastSeenRow>();
        ((lastSeen ?? []) as LastSeenRow[]).forEach((row) => {
          lastSeenMap.set(row.node, row);
        });

        const formatted = (nodeStats ?? []).map((stat: any) => {
          const last = lastSeenMap.get(stat.node);

          const locationStr =
            last && last.location
              ? `(${last.location.x.toFixed(5)}, ${last.location.y.toFixed(5)})`
              : "—";

          return [
            stat.node.toString(),
            stat.samples > 0 ? "Online" : "No Data",
            last ? new Date(last.measured_at).toLocaleString() : "—",
            // Use point properties x and y (guarded)
            locationStr,
            stat.avg_co2?.toFixed(2) ?? "—",
            stat.avg_noise?.toFixed(2) ?? "—",
            stat.avg_humidity?.toFixed(2) ?? "—",
            stat.avg_uv?.toFixed(2) ?? "—",
            (stat.samples ?? 0).toString(),
          ];
        });

        setRows(formatted);
      } catch (e) {
        console.error("Unexpected error:", e);
        setError("Unexpected error while loading data");
        setRows([]);
        setTotalCount(null);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [supabase, schema, pageIndex, pageSize]);

  const total = totalCount ?? 0;
  const fromItem = total === 0 ? 0 : pageIndex * pageSize + 1;
  const toItem = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div>
      <PageBreadcrumb pageTitle="Node Statistics" />

      <div className="space-y-6">
        <ComponentCard title="24-Hour Node Statistics">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setSchema("public")}
                className={`px-3 py-1 rounded ${
                  schema === "public"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setSchema("simulation")}
                className={`px-3 py-1 rounded ${
                  schema === "simulation"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                Simulation
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">Schema: {schema}</div>

              <div className="flex items-center gap-2 text-sm">
                <div>
                  <button
                    onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                    disabled={pageIndex === 0 || loading}
                    className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPageIndex((p) =>
                        (p + 1) * pageSize < (totalCount ?? Infinity) ? p + 1 : p
                      )
                    }
                    disabled={(pageIndex + 1) * pageSize >= (totalCount ?? Infinity) || loading}
                    className="ml-2 px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  {loading ? "Loading…" : `${fromItem}–${toItem} of ${total}`}
                </div>

                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="ml-2 px-2 py-1 border rounded text-sm"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 mb-2">Error: {error}</div>
          )}

          <BasicTableOne
            columns={[
              { label: "Node", width: "min-w-[120px]" },
              { label: "Status", width: "w-28" },
              { label: "Last Seen", width: "min-w-[200px]" },
              { label: "Location (lat, lon)", width: "min-w-[200px]" },
              { label: "Avg CO₂", width: "w-28" },
              { label: "Avg Noise", width: "w-28" },
              { label: "Avg Humidity", width: "w-28" },
              { label: "Avg UV", width: "w-28" },
              { label: "Samples", width: "w-24" },
            ]}
            rows={rows}
            rowKey={(row) => row[0]}
            onRowClick={(row) => console.log("Selected:", row)}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
