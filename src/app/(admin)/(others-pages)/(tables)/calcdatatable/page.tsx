"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";

export default function CalcDataTable() {
  const supabase = useSupabase();
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    async function loadStats() {
      const { data: nodeStats, error } = await supabase
        .from("daily_node_stats")
        .select("*")
        .order("node", { ascending: true });

      const { data: locations } = await supabase
        .from("measure_with_location")
        .select("node, location, measured_at")
        .order("measured_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      // Get last-seen + last-known location per node
      const lastSeenMap = new Map();
      (locations ?? []).forEach((row) => {
        if (!lastSeenMap.has(row.node)) {
          lastSeenMap.set(row.node, row);
        }
      });

      const formatted = nodeStats.map((stat) => {
        const last = lastSeenMap.get(stat.node);

        return [
          stat.node.toString(),
          stat.samples > 0 ? "Online" : "No Data",
          last ? new Date(last.measured_at).toLocaleString() : "—",
          last ? `(${last.location.x.toFixed(5)}, ${last.location.y.toFixed(5)})` : "—",
          stat.avg_co2?.toFixed(2) ?? "—",
          stat.avg_noise?.toFixed(2) ?? "—",
          stat.avg_humidity?.toFixed(2) ?? "—",
          stat.avg_uv?.toFixed(2) ?? "—",
          stat.samples ?? 0,
        ];
      });

      setRows(formatted);
    }

    loadStats();
  }, [supabase]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Node Statistics" />

      <div className="space-y-6">
        <ComponentCard title="24-Hour Node Statistics">
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
