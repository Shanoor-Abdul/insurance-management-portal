"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getPolicyById } from "@insurance/lib";
import { formatDate, formatCurrency } from "@insurance/lib";
import { Loader, Card, CardHeader, CardTitle, CardContent, Badge } from "@insurance/ui";
import { PolicyAssignDrawer } from "@/components/PolicyAssignDrawer";

export default function PolicyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: policy, isLoading } = useQuery({
    queryKey: ["policy", id],
    queryFn: () => getPolicyById(id)
  });

  if (isLoading) return <Loader />;
  if (!policy) return <div className="p-8 text-center">{t("common.noResults")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("policies.details.title")}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("policies.details.policyInformation")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{t("policies.table.policyNumber")}:</strong> {policy.policyNumber}</p>
            <p><strong>{t("policies.table.lob")}:</strong> {policy.lob}</p>
            <p><strong>{t("policies.table.status")}:</strong> <Badge>{policy.status}</Badge></p>
            <p><strong>{t("policies.table.startDate")}:</strong> {formatDate(policy.startDate)}</p>
            <p><strong>{t("policies.table.endDate")}:</strong> {formatDate(policy.endDate)}</p>
            <p><strong>{t("policies.table.premium")}:</strong> {formatCurrency(policy.premium)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("policies.details.customerDetails")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{t("policies.table.customerName")}:</strong> {policy.customer.name}</p>
            <p><strong>Email:</strong> {policy.customer.email}</p>
            <p><strong>{t("users.table.mobile")}:</strong> {policy.customer.mobile}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("policies.details.coverage")}</CardTitle></CardHeader>
        <CardContent>{policy.coverage}</CardContent>
      </Card>
      <PolicyAssignDrawer policy={policy} />
    </div>
  );
}
