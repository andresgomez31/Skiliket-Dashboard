"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface ColumnConfig {
  label: string;      // Column header
  width?: string;     // Tailwind width, e.g. "w-32" or "min-w-[200px]"
}

interface BasicTableProps {
  columns: ColumnConfig[];
  rows: (string[])[]; // Each row is a list of text cells
  rowKey?: (row: string[], rowIndex: number) => string | number;
  onRowClick?: (row: string[], rowIndex: number) => void;
}

export default function BasicTable({
  columns,
  rows,
  rowKey,
  onRowClick,
}: BasicTableProps) {
  // Validation to ensure row size matches header count
  const validRows = rows.filter((r) => r.length === columns.length);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            {/* Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${col.width ?? ""}`}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {validRows.map((row, rowIndex) => {
                const key = rowKey ? rowKey(row, rowIndex) : rowIndex;

                return (
                  // keep row element free of onClick (some table row components don't accept it)
                  <TableRow
                    key={key}
                    className={onRowClick ? "cursor-pointer" : "cursor-default"}
                  >
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="px-5 py-3 text-gray-600 text-start text-theme-sm dark:text-gray-300"
                      >
                        {/* clickable div inside the cell so the row click works reliably */}
                        <div
                          onClick={() => onRowClick?.(row, rowIndex)}
                          role={onRowClick ? "button" : undefined}
                          tabIndex={onRowClick ? 0 : undefined}
                          onKeyDown={
                            onRowClick
                              ? (e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    onRowClick(row, rowIndex);
                                  }
                                }
                              : undefined
                          }
                          className="w-full"
                        >
                          {cell}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
