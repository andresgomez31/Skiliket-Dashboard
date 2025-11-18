"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface LineChartProps {
  title: string;
  xLabel: string;
  yLabel: string;
  xValues: string[];
  ySeries: {
    name: string;
    data: number[];
  }[];
}

export default function LineChartOne({
  title,
  xLabel,
  yLabel,
  xValues,
  ySeries,
}: LineChartProps) {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },

    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },

    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },

    dataLabels: { enabled: false },

    tooltip: {
      enabled: true,
      x: { show: true }, // generic X label (not date formatted)
    },

    xaxis: {
      type: "category",
      categories: xValues,
      title: {
        text: xLabel,
        style: { fontSize: "14px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      title: {
        text: yLabel,
        style: { fontSize: "14px" },
      },
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[1000px]">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-3">{title}</h3>

        <ReactApexChart options={options} series={ySeries} type="area" height={310} />
      </div>
    </div>
  );
}
