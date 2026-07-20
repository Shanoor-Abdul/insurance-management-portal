"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getPolicyById, getUsers, assignPolicy, useAppStore } from "@insurance/lib";
import { formatDate, formatCurrency, type User } from "@insurance/lib";
import { Loader, Card, CardHeader, CardTitle, CardContent, Badge, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Checkbox, Input, Pagination } from "@insurance/ui";

export default function PolicyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: policy, isLoading: policyLoading } = useQuery({
    queryKey: ["policy", id],
    queryFn: () => getPolicyById(id)
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  // User assignment state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const userPageSize = 10;

  useEffect(() => {
    if (policy) {
      setSelectedUserIds(policy.assignedUsers || []);
    }
  }, [policy]);

  const updateAssignMutation = useMutation({
    mutationFn: (userIds: string[]) => assignPolicy(id, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy", id] });
    }
  });

  const userMap = useMemo(() => {
    const map: Record<string, User> = {};
    (users as User[]).forEach((u) => { map[u.id] = u; });
    return map;
  }, [users]);

  const assignedUserDetails = useMemo(() => {
    if (!policy) return [];
    return policy.assignedUsers
      .map((uid: string) => userMap[uid])
      .filter(Boolean) as User[];
  }, [policy, userMap]);

  // Filter users for assignment table
  const filteredUsers = useMemo(() => {
    let list = users as User[];
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, userSearch]);

  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * userPageSize,
    userPage * userPageSize
  );
  const userTotalPages = Math.ceil(filteredUsers.length / userPageSize) || 1;

  const toggleUser = (uid: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]
    );
  };

  const handleUpdateAssign = () => {
    updateAssignMutation.mutate(selectedUserIds);
  };

  if (policyLoading || usersLoading) return <Loader />;
  if (!policy) return <div className="p-8 text-center text-gray-500">{t("common.noResults")}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("policies.details.title")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            useAppStore.getState().setSelectedPolicyIds([policy.id]);
            router.push(`/${lang}/claims/new`);
          }}>
            + {t("claims.create")}
          </Button>
        </div>
      </div>

      {/* Policy Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>{t("policies.details.policyInformation")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{t("policies.table.policyNumber")}:</strong> {policy.policyNumber}</p>
            <p><strong>{t("policies.table.lob")}:</strong> {policy.lob}</p>
            <p><strong>{t("policies.table.status")}:</strong> <Badge>{policy.status}</Badge></p>
            <p><strong>{t("policies.table.startDate")}:</strong> {formatDate(policy.startDate)}</p>
            <p><strong>{t("policies.table.endDate")}:</strong> {formatDate(policy.endDate)}</p>
            <p><strong>{t("policies.table.premium")}:</strong> {formatCurrency(policy.premium)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("policies.details.customerDetails")}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>{t("policies.table.customerName")}:</strong> {policy.customer.name}</p>
            <p><strong>Email:</strong> {policy.customer.email}</p>
            <p><strong>{t("users.table.mobile")}:</strong> {policy.customer.mobile}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("policies.details.coverage")}</CardTitle></CardHeader>
        <CardContent>{policy.coverage}</CardContent>
      </Card>

      {/* Assigned Users Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Users ({assignedUserDetails.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {assignedUserDetails.length === 0 ? (
            <p className="text-sm text-gray-500">No users assigned to this policy.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedUserDetails.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant={user.role === "admin" ? "success" : "default"}>{user.role}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/${lang}/users/${user.id}`)}>
                          {t("common.edit")}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          useAppStore.getState().setSelectedPolicyIds([policy.id]);
                          router.push(`/${lang}/claims/new`);
                        }}>
                          + {t("claims.create")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Assignment Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage User Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search users by name, email or role..."
            value={userSearch}
            onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assign</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">No users found</TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleUser(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge>{user.role}</Badge></TableCell>
                    <TableCell><Badge variant={user.status === "Active" ? "success" : "default"}>{user.status}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination page={userPage} totalPages={userTotalPages} onPageChange={setUserPage} />
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleUpdateAssign}
              disabled={updateAssignMutation.isPending}
            >
              {updateAssignMutation.isPending ? t("common.loading") : "Update Assignments"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claim History */}
      {policy.claimHistory && policy.claimHistory.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("policies.details.claimHistory")}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {policy.claimHistory.map((claimId: string) => (
                <div key={claimId} className="flex items-center justify-between rounded border p-3">
                  <span className="text-sm">Claim ID: {claimId}</span>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/${lang}/claims/${claimId}`)}>
                    {t("common.view")}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}