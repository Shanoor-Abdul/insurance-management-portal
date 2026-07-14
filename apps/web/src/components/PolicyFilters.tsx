"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@insurance/ui";
import type { LOB, PolicyStatus } from "@insurance/lib";

export interface PolicyFiltersState {
  lob: LOB | "All";
  status: PolicyStatus | "All";
  search: string;
  startDate: string;
  endDate: string;
}

export function PolicyFilters({ filters, onChange }: { filters: PolicyFiltersState; onChange: (f: PolicyFiltersState) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-4">
      <select className="rounded border p-2" value={filters.lob} onChange={(e) => onChange({ ...filters, lob: e.target.value as LOB | "All" })}>
        <option value="All">{t("policies.filters.lob")}</option>
        <option value="Health">Health</option>
        <option value="Motor">Motor</option>
        <option value="General">General</option>
      </select>
      <select className="rounded border p-2" value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value as PolicyStatus | "All" })}>
        <option value="All">{t("policies.filters.status")}</option>
        <option value="Active">Active</option>
        <option value="Expired">Expired</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Pending">Pending</option>
      </select>
      <input
        type="text"
        placeholder={t("policies.filters.search")}
        className="rounded border p-2"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <input
        type="date"
        className="rounded border p-2"
        value={filters.startDate}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
      />
      <input
        type="date"
        className="rounded border p-2"
        value={filters.endDate}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
      />
      <Button variant="outline" onClick={() => onChange({ lob: "All", status: "All", search: "", startDate: "", endDate: "" })}>Reset</Button>
    </div>
  );
}
