"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPolicies, useAppStore, type Policy } from "@insurance/lib";
import { Modal, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Checkbox, Input, Pagination } from "@insurance/ui";

export function AssignPoliciesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { data: policies } = useQuery({ queryKey: ["policies"], queryFn: () => getPolicies() });
  const selectedIds = useAppStore((s) => s.selectedPolicyIds);
  const togglePolicySelection = useAppStore((s) => s.togglePolicySelection);

  const [search, setSearch] = useState("");
  const [lob, setLob] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = (policies || []) as Policy[];
    if (lob !== "All") list = list.filter((p) => p.lob === lob);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.policyNumber.toLowerCase().includes(q) || p.customer.name.toLowerCase().includes(q));
    }
    return list;
  }, [policies, lob, search]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const handleClose = () => {
    setPage(1);
    setSearch("");
    setLob("All");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t("users.sections.assignPolicies")}
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>{t("common.cancel")}</Button>
          <Button onClick={handleClose}>{t("common.save")}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">{t("users.selectionPersistence")}</p>
        <div className="flex flex-wrap gap-3">
          <Input placeholder="Search policy" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select className="rounded border p-2" value={lob} onChange={(e) => { setLob(e.target.value); setPage(1); }}>
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
            {paginated.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(p.id)}
                    onChange={() => togglePolicySelection(p.id)}
                  />
                </TableCell>
                <TableCell>{p.policyNumber}</TableCell>
                <TableCell>{p.customer.name}</TableCell>
                <TableCell>{p.lob}</TableCell>
                <TableCell>${p.premium}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </Modal>
  );
}
