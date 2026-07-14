"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getClaims, type LOB, type ClaimStatus } from "@insurance/lib";
import { Card, CardHeader, CardTitle, CardContent, Loader, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from "@insurance/ui";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ClaimFilters {
  lob: LOB | "All";
  status: ClaimStatus | "All";
  search: string;
}

export default function ClaimsPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [filters, setFilters] = useState<ClaimFilters>({ lob: "All", status: "All", search: "" });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["claims", filters],
    queryFn: () => getClaims(filters)
  });

  const pageSize = 10;
  const paginated = (data || []).slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil((data || []).length / pageSize) || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("claims.title")}</h1>
      <Card>
        <CardHeader><CardTitle>{t("common.filter")}</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <select className="rounded border p-2" value={filters.lob} onChange={(e) => { setFilters({ ...filters, lob: e.target.value as LOB | "All" }); setPage(1); }}>
              <option value="All">{t("claims.filters.lob")}</option>
              <option value="Health">Health</option>
              <option value="Motor">Motor</option>
              <option value="General">General</option>
            </select>
            <select className="rounded border p-2" value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value as ClaimStatus | "All" }); setPage(1); }}>
              <option value="All">{t("claims.filters.status")}</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Settled">Settled</option>
            </select>
            <input type="text" placeholder={t("claims.filters.search")} className="rounded border p-2" value={filters.search} onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {isLoading ? <Loader /> : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("claims.table.claimNumber")}</TableHead>
                    <TableHead>{t("claims.table.policyNumber")}</TableHead>
                    <TableHead>{t("claims.table.customer")}</TableHead>
                    <TableHead>{t("claims.table.lob")}</TableHead>
                    <TableHead>{t("claims.table.amount")}</TableHead>
                    <TableHead>{t("claims.table.status")}</TableHead>
                    <TableHead>{t("claims.table.submittedDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>
                        <Link href={`/${lang}/claims/${claim.id}`} className="text-indigo-600 hover:underline">{claim.claimNumber}</Link>
                      </TableCell>
                      <TableCell>{claim.policyNumber}</TableCell>
                      <TableCell>{claim.customer.name}</TableCell>
                      <TableCell>{claim.lob}</TableCell>
                      <TableCell>${claim.amount}</TableCell>
                      <TableCell><Badge variant={claim.status === "Approved" ? "success" : claim.status === "Rejected" ? "danger" : "warning"}>{claim.status}</Badge></TableCell>
                      <TableCell>{claim.submittedDate}</TableCell>
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
