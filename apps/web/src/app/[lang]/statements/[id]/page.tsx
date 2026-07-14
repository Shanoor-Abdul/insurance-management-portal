"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getStatementById } from "@insurance/lib";
import { Loader, Card, CardHeader, CardTitle, CardContent, Badge } from "@insurance/ui";

export default function StatementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: statement, isLoading } = useQuery({
    queryKey: ["statement", id],
    queryFn: () => getStatementById(id)
  });

  if (isLoading) return <Loader />;
  if (!statement) return <div className="p-8 text-center">{t("common.noResults")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("statements.title")}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("statements.table.customer")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {statement.customer.name}</p>
            <p><strong>Email:</strong> {statement.customer.email}</p>
            <p><strong>Mobile:</strong> {statement.customer.mobile}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("statements.table.policyNumber")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{t("statements.table.policyNumber")}:</strong> {statement.policyNumber}</p>
            <p><strong>{t("statements.table.premium")}:</strong> ${statement.premium}</p>
            <p><strong>{t("statements.table.paidAmount")}:</strong> ${statement.paidAmount}</p>
            <p><strong>{t("statements.table.pendingAmount")}:</strong> ${statement.pendingAmount}</p>
            <p><strong>{t("statements.table.dueDate")}:</strong> {statement.dueDate}</p>
            <p><strong>{t("statements.table.status")}:</strong> <Badge>{statement.status}</Badge></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
