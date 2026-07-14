"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getUsers, assignPolicy, type Policy } from "@insurance/lib";
import { Button, Drawer, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Checkbox } from "@insurance/ui";

export function PolicyAssignDrawer({ policy }: { policy: Policy }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(policy.assignedUsers);
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: getUsers });

  const filtered = (users || []).filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAssign = async () => {
    await assignPolicy(policy.id, selected);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("policies.actions.assign")}</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title={t("policies.actions.assign")}>
        <div className="space-y-4">
          <Input placeholder="Search user / filter by role" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell><Checkbox checked={selected.includes(u.id)} onChange={() => toggle(u.id)} /></TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleAssign}>{t("common.save")}</Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
