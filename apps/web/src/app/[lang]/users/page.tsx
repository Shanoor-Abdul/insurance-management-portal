"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getUsers, type User } from "@insurance/lib";
import { Card, CardContent, Button, Loader, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, ConfirmDialog, Badge } from "@insurance/ui";
import { useParams, useRouter } from "next/navigation";

export default function UsersPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleteId(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("users.title")}</h1>
        <Button onClick={() => router.push(`/${lang}/users/new`)}>{t("users.create")}</Button>
      </div>
      <Card>
        <CardContent>
          {isLoading ? <Loader /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("users.table.name")}</TableHead>
                  <TableHead>{t("users.table.email")}</TableHead>
                  <TableHead>{t("users.table.mobile")}</TableHead>
                  <TableHead>{t("users.table.role")}</TableHead>
                  <TableHead>{t("users.table.status")}</TableHead>
                  <TableHead>{t("users.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell><Badge variant={user.status === "Active" ? "success" : "default"}>{user.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/${lang}/users/${user.id}`)}>{t("common.view")}</Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteId(user.id)}>{t("common.delete")}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("common.delete")}
        message="Are you sure you want to delete this user?"
        confirmLabel={t("common.delete")}
      />
    </div>
  );
}
