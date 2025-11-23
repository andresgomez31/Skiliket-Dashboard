import type { Metadata } from "next";
import React from "react";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import LineChart from "@/components/charts/line/LineChartOne";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function CalcData() {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <div className="col-span-1 space-y-6">
        <BarChartOne
          title="Total Events per Device"
          xLabel="Device ID"
          yLabel="Events"
          xValues={["Sensor A", "Sensor B", "Sensor C", "Sensor D"]}
          ySeries={[
            {
              name: "Events",
              data: [120, 90, 150, 200],
            },
          ]}
        />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <LineChart
          title="Temperature Over Time"
          xLabel="Time (hours)"
          yLabel="Temperature (°C)"
          xValues={["10:00", "11:00", "12:00", "13:00"]}
          ySeries={[
            {
              name: "Sensor A",
              data: [21, 22.5, 23, 24],
            },
            {
              name: "Sensor B",
              data: [20, 21, 21.5, 22],
            },
          ]}
        />
      </div>
    </div>
  );
}
