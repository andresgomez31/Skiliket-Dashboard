"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// ------------------------
// Props
// ------------------------
interface BarChartProps {
  title: string;
  xLabel: string;
  yLabel: string;
  xValues: string[];
  ySeries: {
    name: string;
    data: number[];
  }[];
}

// ------------------------
// Component
// ------------------------
export default function BarChartOne({
  title,
  xLabel,
  yLabel,
  xValues,
  ySeries,
}: BarChartProps) {
  const options: ApexOptions = {
    colors: ["#465fff"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: { enabled: false },

    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },

    xaxis: {
      categories: xValues,
      title: {
        text: xLabel,
        style: { fontSize: "14px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },

    yaxis: {
      title: {
        text: yLabel,
        style: { fontSize: "14px" },
      },
    },

    grid: {
      yaxis: { lines: { show: true } },
    },

    fill: { opacity: 1 },

    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[1000px]">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        <ReactApexChart
          options={options}
          series={ySeries}
          type="bar"
          height={180}
        />
      </div>
    </div>
  );
}
