"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getStatements, type LOB, type Statement } from "@insurance/lib";
import { Card, CardHeader, CardTitle, CardContent, Loader, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination, Input } from "@insurance/ui";
import { useParams } from "next/navigation";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function StatementsPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [lob, setLob] = useState<LOB | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["statements", { lob }],
    queryFn: () => getStatements({ lob })
  });

  const filtered = useMemo(() => {
    let list = data || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.policyNumber.toLowerCase().includes(q) ||
          s.customer.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, search]);

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE) || 1, [filtered]);

  const summary = useMemo(() => ({
    totalRevenue: (data || []).reduce((sum, s) => sum + s.premium, 0),
    pending: (data || []).filter((s) => s.status === "Pending").reduce((sum, s) => sum + s.pendingAmount, 0),
    settled: (data || []).filter((s) => s.status === "Paid").reduce((sum, s) => sum + s.paidAmount, 0),
    overdue: (data || []).filter((s) => s.status === "Overdue").reduce((sum, s) => sum + s.pendingAmount, 0)
  }), [data]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("statements.title")}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle>{t("statements.cards.totalRevenue")}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>{t("statements.cards.pendingPayments")}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">${summary.pending.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>{t("statements.cards.settledPayments")}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">${summary.settled.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle>{t("statements.cards.overduePayments")}</CardTitle></CardHeader><CardContent className="text-2xl font-bold">${summary.overdue.toLocaleString()}</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{t("common.filter")}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <select className="rounded border p-2" value={lob} onChange={(e) => { setLob(e.target.value as LOB | "All"); setPage(1); }}>
              <option value="All">{t("statements.filters.lob")}</option>
              <option value="Health">Health</option>
              <option value="Motor">Motor</option>
              <option value="General">General</option>
            </select>
            <Input
              placeholder="Search by Policy # or Customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {isLoading ? <Loader /> : paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-500">{t("common.noResults")}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("statements.table.policyNumber")}</TableHead>
                    <TableHead>{t("statements.table.customer")}</TableHead>
                    <TableHead>{t("statements.table.lob")}</TableHead>
                    <TableHead>{t("statements.table.premium")}</TableHead>
                    <TableHead>{t("statements.table.paidAmount")}</TableHead>
                    <TableHead>{t("statements.table.pendingAmount")}</TableHead>
                    <TableHead>{t("statements.table.dueDate")}</TableHead>
                    <TableHead>{t("statements.table.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((s: Statement) => (
                    <TableRow key={s.id}>
                      <TableCell><Link href={`/${lang}/statements/${s.id}`} className="text-indigo-600 hover:underline">{s.policyNumber}</Link></TableCell>
                      <TableCell>{s.customer.name}</TableCell>
                      <TableCell>{s.lob}</TableCell>
                      <TableCell>${s.premium}</TableCell>
                      <TableCell>${s.paidAmount}</TableCell>
                      <TableCell>${s.pendingAmount}</TableCell>
                      <TableCell>{s.dueDate}</TableCell>
                      <TableCell><Badge variant={s.status === "Paid" ? "success" : s.status === "Overdue" ? "danger" : "warning"}>{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}