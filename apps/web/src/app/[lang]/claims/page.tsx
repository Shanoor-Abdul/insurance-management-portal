"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getClaims, type LOB, type ClaimStatus, type Claim } from "@insurance/lib";
import { Card, CardHeader, CardTitle, CardContent, Loader, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination, Button } from "@insurance/ui";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function ClaimsPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [filters, setFilters] = useState({ lob: "All" as LOB | "All", status: "All" as ClaimStatus | "All", search: "" });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["claims", filters],
    queryFn: () => getClaims(filters)
  });

  const paginated = useMemo(() => {
    const list = data || [];
    return list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [data, page]);

  const totalPages = useMemo(() => Math.ceil((data || []).length / PAGE_SIZE) || 1, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("claims.title")}</h1>
        <Button onClick={() => router.push(`/${lang}/claims/new`)}>
          + {t("claims.create")}
        </Button>
      </div>
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
            <input
              type="text"
              placeholder={t("claims.filters.search")}
              className="rounded border p-2"
              value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {isLoading ? <Loader /> : !paginated || paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-500">{t("common.noResults")}</div>
          ) : (
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
                  {paginated.map((claim: Claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>
                        <Link href={`/${lang}/claims/${claim.id}`} className="text-indigo-600 hover:underline">{claim.claimNumber}</Link>
                      </TableCell>
                      <TableCell>{claim.policyNumber}</TableCell>
                      <TableCell>{claim.customer.name}</TableCell>
                      <TableCell>{claim.lob}</TableCell>
                      <TableCell>${claim.amount}</TableCell>
                      <TableCell><Badge variant={claim.status === "Approved" ? "success" : claim.status === "Rejected" ? "danger" : claim.status === "Settled" ? "default" : "warning"}>{claim.status}</Badge></TableCell>
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