"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React from "react";

export default function CalcDataTable() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne
            columns={[
              { label: "Device ID", width: "min-w-[150px]" },
              { label: "Status", width: "w-32" },
              { label: "Last Seen", width: "min-w-[200px]" },
              { label: "Location", width: "min-w-[200px]" },
            ]}
            rows={[
              ["sensor-001", "Online", "2025-01-01 14:33", "Server Room"],
              ["sensor-002", "Offline", "2025-01-01 10:12", "Warehouse"],
              ["sensor-003", "Online", "2025-01-01 13:21", "Office 2"],
            ]}
            rowKey={(row) => row[0]}
            onRowClick={(row) => console.log("Selected:", row)}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
