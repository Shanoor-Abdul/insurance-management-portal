"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import {
  getPolicies,
  useAppStore,
  type Policy,
} from "@insurance/lib";

import {
  Checkbox,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@insurance/ui";

export function AssignPoliciesTable() {
  const { t } = useTranslation();

  const { data: policies = [] } = useQuery({
    queryKey: ["policies"],
    queryFn: () => getPolicies(),
  });

  const selectedIds = useAppStore((s) => s.selectedPolicyIds);
  const togglePolicySelection = useAppStore(
    (s) => s.togglePolicySelection
  );

  const [search, setSearch] = useState("");
  const [lob, setLob] = useState("All");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = policies as Policy[];

    if (lob !== "All") {
      list = list.filter((p) => p.lob === lob);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter(
        (p) =>
          p.policyNumber.toLowerCase().includes(q) ||
          p.customer.name.toLowerCase().includes(q)
      );
    }

    return list;
  }, [policies, search, lob]);

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {selectedIds.length} policies selected
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder={t("policies.filter.search")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="rounded border p-2"
          value={lob}
          onChange={(e) => {
            setLob(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All LOB</option>
          <option value="Health">Health</option>
          <option value="Motor">Motor</option>
          <option value="General">General</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Select</TableHead>
            <TableHead>Policy Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>LOB</TableHead>
            <TableHead>Premium</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginated.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No policies found
              </TableCell>
            </TableRow>
          ) : (
            paginated.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(policy.id)}
                    onChange={() =>
                      togglePolicySelection(policy.id)
                    }
                  />
                </TableCell>

                <TableCell>{policy.policyNumber}</TableCell>
                <TableCell>{policy.customer.name}</TableCell>
                <TableCell>{policy.lob}</TableCell>
                <TableCell>${policy.premium}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}