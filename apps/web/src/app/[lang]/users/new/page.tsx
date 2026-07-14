"use client";

import { useTranslation } from "react-i18next";
import { UserForm } from "@/components/UserForm";

export default function NewUserPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("users.create")}</h1>
      <UserForm />
    </div>
  );
}
