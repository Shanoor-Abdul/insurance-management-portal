"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPolicies } from "@insurance/lib";
import { PolicyFilters, type PolicyFiltersState } from "@/components/PolicyFilters";
import { PolicyTable } from "@/components/PolicyTable";
import { Loader, Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";

export default function PoliciesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PolicyFiltersState>({ lob: "All", status: "All", search: "", startDate: "", endDate: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["policies", filters],
    queryFn: () => getPolicies(filters)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("policies.title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("policies.filters.search")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PolicyFilters filters={filters} onChange={setFilters} />
          {isLoading ? <Loader /> : <PolicyTable policies={data || []} />}
        </CardContent>
      </Card>
    </div>
  );
}
