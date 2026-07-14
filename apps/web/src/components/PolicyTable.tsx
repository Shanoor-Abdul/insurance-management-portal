"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Pagination } from "@insurance/ui";
import { formatDate, formatCurrency, type Policy } from "@insurance/lib";

export function PolicyTable({ policies }: { policies: Policy[] }) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginated = policies.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(policies.length / pageSize) || 1;

  const statusVariant: Record<string, "default" | "success" | "warning" | "danger"> = {
    Active: "success",
    Expired: "default",
    Cancelled: "danger",
    Pending: "warning"
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("policies.table.policyNumber")}</TableHead>
            <TableHead>{t("policies.table.customerName")}</TableHead>
            <TableHead>{t("policies.table.lob")}</TableHead>
            <TableHead>{t("policies.table.status")}</TableHead>
            <TableHead>{t("policies.table.startDate")}</TableHead>
            <TableHead>{t("policies.table.endDate")}</TableHead>
            <TableHead>{t("policies.table.premium")}</TableHead>
            <TableHead>{t("policies.table.assignedUser")}</TableHead>
            <TableHead>{t("policies.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.policyNumber}</TableCell>
              <TableCell>{p.customer.name}</TableCell>
              <TableCell>{p.lob}</TableCell>
              <TableCell><Badge variant={statusVariant[p.status] || "default"}>{p.status}</Badge></TableCell>
              <TableCell>{formatDate(p.startDate)}</TableCell>
              <TableCell>{formatDate(p.endDate)}</TableCell>
              <TableCell>{formatCurrency(p.premium)}</TableCell>
              <TableCell>{p.assignedUsers.length ? p.assignedUsers.join(", ") : "—"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/${lang}/policies/${p.id}`)}>{t("policies.actions.view")}</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
