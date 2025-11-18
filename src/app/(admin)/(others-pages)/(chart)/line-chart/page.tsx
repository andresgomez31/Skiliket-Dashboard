import LineChartOne from "@/components/charts/line/LineChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Line Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Line Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};
export default function LineChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne
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
        </ComponentCard>
      </div>
    </div>
  );
}
