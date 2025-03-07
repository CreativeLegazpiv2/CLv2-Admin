"use client";

import React from "react";
import PaginatedTable from "./featuredTable";

export default function Featured() {
  return (
    <main className="flex gap-4 p-24">
      <PaginatedTable />
    </main>
  );
}
