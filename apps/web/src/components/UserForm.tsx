"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createUser, updateUser, useAppStore, privileges, type User, type Privilege } from "@insurance/lib";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Checkbox } from "@insurance/ui";
import { userSchema, type UserFormData } from "@/lib/zodSchemas";
import { AssignPoliciesModal } from "./AssignPoliciesModal";

export function UserForm({ initialData }: { initialData?: User }) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const [showAssign, setShowAssign] = useState(false);
  const selectedPolicyIds = useAppStore((s) => s.selectedPolicyIds);
  const setSelectedPolicyIds = useAppStore((s) => s.setSelectedPolicyIds);
  const clearSelected = useAppStore((s) => s.clearSelectedPolicyIds);

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      name: "", employeeId: "", email: "", mobile: "", username: "", password: "", confirmPassword: "",
      department: "", designation: "", status: "Active", role: "agent"
    }
  });

  useEffect(() => {
    if (initialData) {
      setSelectedPolicyIds(initialData.policies);
    } else {
      clearSelected();
    }
  }, [initialData, setSelectedPolicyIds, clearSelected]);

  const [enabledPrivileges, setEnabledPrivileges] = useState<Privilege[]>((initialData?.privileges as Privilege[]) || []);

  const saveMutation = useMutation({
    mutationFn: (data: UserFormData & { policies: string[]; privileges: Privilege[] }) => {
      if (initialData) {
        return updateUser(initialData.id, { ...data, id: initialData.id });
      }
      return createUser({ ...data });
    },
    onSuccess: () => {
      clearSelected();
      router.push(`/${lang}/users`);
    }
  });

  const onSubmit = (data: UserFormData) => {
    saveMutation.mutate({ ...data, policies: selectedPolicyIds, privileges: enabledPrivileges });
  };

  const togglePrivilege = (id: Privilege) => {
    setEnabledPrivileges((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>{t("users.sections.basic")}</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input {...register("name")} placeholder={t("users.fields.name")} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          <Input {...register("employeeId")} placeholder={t("users.fields.employeeId")} />
          <Input {...register("email")} placeholder={t("users.fields.email")} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          <Input {...register("mobile")} placeholder={t("users.fields.mobile")} />
          <Input {...register("username")} placeholder={t("users.fields.username")} />
          {!initialData && <Input type="password" {...register("password")} placeholder={t("users.fields.password")} />}
          {!initialData && <Input type="password" {...register("confirmPassword")} placeholder={t("users.fields.confirmPassword")} />}
          <Input {...register("department")} placeholder={t("users.fields.department")} />
          <Input {...register("designation")} placeholder={t("users.fields.designation")} />
          <select {...register("status")} className="rounded border p-2">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select {...register("role")} className="rounded border p-2">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t("users.sections.privileges")}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {privileges.map((p) => (
              <Checkbox
                key={p.id}
                label={p.label}
                checked={enabledPrivileges.includes(p.id as Privilege)}
                onChange={() => togglePrivilege(p.id as Privilege)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t("users.sections.assignPolicies")}</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-gray-600">{selectedPolicyIds.length} policies selected</p>
          <Button type="button" variant="outline" onClick={() => setShowAssign(true)}>{t("users.sections.assignPolicies")}</Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push(`/${lang}/users`)}>{t("common.cancel")}</Button>
        <Button type="submit" disabled={saveMutation.isPending}>{t("common.save")}</Button>
      </div>

      <AssignPoliciesModal open={showAssign} onClose={() => setShowAssign(false)} />
    </form>
  );
}
