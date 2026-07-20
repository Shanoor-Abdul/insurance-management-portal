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
import { AssignPoliciesTable } from "./AssignPoliciesTable";

export function UserForm({ initialData }: { initialData?: User }) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();
  const selectedPolicyIds = useAppStore((s) => s.selectedPolicyIds);
  const setSelectedPolicyIds = useAppStore((s) => s.setSelectedPolicyIds);
  const clearSelected = useAppStore((s) => s.clearSelectedPolicyIds);

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: initialData ? {
      name: initialData.name,
      employeeId: initialData.employeeId,
      email: initialData.email,
      mobile: initialData.mobile,
      username: initialData.username,
      password: "",
      confirmPassword: "",
      department: initialData.department,
      designation: initialData.designation,
      status: initialData.status,
      role: initialData.role
    } : {
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
      // Remove password fields if empty (on edit)
      const payload: Record<string, unknown> = { ...data, policies: data.policies, privileges: data.privileges };
      if (!payload.password) {
        delete payload.password;
        delete payload.confirmPassword;
      }
      if (initialData) {
        return updateUser(initialData.id, { ...payload, id: initialData.id });
      }
      return createUser(payload as unknown as Omit<User, "id">);
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.name")}</label>
            <Input {...register("name")} placeholder={t("users.fields.name")} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.employeeId")}</label>
            <Input {...register("employeeId")} placeholder={t("users.fields.employeeId")} />
            {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.email")}</label>
            <Input {...register("email")} placeholder={t("users.fields.email")} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.mobile")}</label>
            <Input {...register("mobile")} placeholder={t("users.fields.mobile")} />
            {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.username")}</label>
            <Input {...register("username")} placeholder={t("users.fields.username")} />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {t("users.fields.password")}{initialData ? " (optional)" : ""}
            </label>
            <Input type="password" {...register("password")} placeholder={initialData ? t("users.fields.password") + " " + t("common.optional") : t("users.fields.password")} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.confirmPassword")}</label>
            <Input type="password" {...register("confirmPassword")} placeholder={t("users.fields.confirmPassword")} />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.department")}</label>
            <Input {...register("department")} placeholder={t("users.fields.department")} />
            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.designation")}</label>
            <Input {...register("designation")} placeholder={t("users.fields.designation")} />
            {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{t("users.fields.status")}</label>
            <select {...register("status")} className="w-full rounded border border-gray-300 p-2 text-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select {...register("role")} className="w-full rounded border border-gray-300 p-2 text-sm">
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="agent">Agent</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
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
          <AssignPoliciesTable />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => { clearSelected(); router.push(`/${lang}/users`); }}>{t("common.cancel")}</Button>
        <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? t("common.loading") : t("common.save")}</Button>
      </div>
    </form>
  );
}