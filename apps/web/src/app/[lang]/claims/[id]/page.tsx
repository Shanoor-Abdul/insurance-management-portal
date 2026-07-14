"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getClaimById } from "@insurance/lib";
import { Loader, Card, CardHeader, CardTitle, CardContent, Badge } from "@insurance/ui";

export default function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: claim, isLoading } = useQuery({
    queryKey: ["claim", id],
    queryFn: () => getClaimById(id)
  });

  if (isLoading) return <Loader />;
  if (!claim) return <div className="p-8 text-center">{t("common.noResults")}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("claims.details.title")}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("claims.details.policyDetails")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{t("claims.table.claimNumber")}:</strong> {claim.claimNumber}</p>
            <p><strong>{t("claims.table.policyNumber")}:</strong> {claim.policyNumber}</p>
            <p><strong>{t("claims.table.lob")}:</strong> {claim.lob}</p>
            <p><strong>{t("claims.table.status")}:</strong> <Badge>{claim.status}</Badge></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("claims.table.customer")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {claim.customer.name}</p>
            <p><strong>Email:</strong> {claim.customer.email}</p>
            <p><strong>Mobile:</strong> {claim.customer.mobile}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("claims.details.notes")}</CardTitle></CardHeader>
        <CardContent>{claim.notes}</CardContent>
      </Card>
    </div>
  );
}
