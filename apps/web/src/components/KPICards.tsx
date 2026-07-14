"use client";

import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPolicies, getClaims, getStatements } from "@insurance/lib";
import { Card, CardContent, CardHeader, CardTitle } from "@insurance/ui";

export function KPICards() {
  const { t } = useTranslation();
  const { data: policies } = useQuery({ queryKey: ["policies"], queryFn: () => getPolicies() });
  const { data: claims } = useQuery({ queryKey: ["claims"], queryFn: () => getClaims() });
  const { data: statements } = useQuery({ queryKey: ["statements"], queryFn: () => getStatements() });

  const totalRevenue = (statements || []).reduce((sum, s) => sum + s.premium, 0);
  const pendingPayments = (statements || []).filter((s) => s.status === "Pending").reduce((sum, s) => sum + s.pendingAmount, 0);

  const kpis = [
    { label: t("dashboard.kpis.totalPolicies"), value: (policies || []).length },
    { label: t("dashboard.kpis.totalClaims"), value: (claims || []).length },
    { label: t("dashboard.kpis.pendingClaims"), value: (claims || []).filter((c) => c.status === "Pending").length },
    { label: t("dashboard.kpis.approvedClaims"), value: (claims || []).filter((c) => c.status === "Approved").length },
    { label: t("dashboard.kpis.rejectedClaims"), value: (claims || []).filter((c) => c.status === "Rejected").length },
    { label: t("dashboard.kpis.revenue"), value: `$${totalRevenue.toLocaleString()}` },
    { label: t("dashboard.kpis.pendingPayments"), value: `$${pendingPayments.toLocaleString()}` }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">{kpi.label}</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{kpi.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
