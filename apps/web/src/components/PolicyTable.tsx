"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Pagination } from "@insurance/ui";
import { formatDate, formatCurrency, getUsers, type Policy, type User } from "@insurance/lib";

export function PolicyTable({ policies }: { policies: Policy[] }) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: users = [] } = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const userMap = useMemo(() => {
    const map: Record<string, string> = {};
    (users as User[]).forEach((u) => { map[u.id] = u.name; });
    return map;
  }, [users]);

  const paginated = useMemo(() => policies.slice((page - 1) * pageSize, page * pageSize), [policies, page]);
  const totalPages = useMemo(() => Math.ceil(policies.length / pageSize) || 1, [policies]);

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
              <TableCell>
                {p.assignedUsers.length > 0
                  ? <span className="flex flex-wrap gap-1">
                      {p.assignedUsers.map((uid) => (
                        <span key={uid} className="inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                          {userMap[uid] || uid}
                        </span>
                      ))}
                    </span>
                  : <span className="text-gray-400">—</span>
                }
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/${lang}/policies/${p.id}`)}>{t("policies.actions.view")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}