"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getUserById } from "@insurance/lib";
import { Loader } from "@insurance/ui";
import { UserForm } from "@/components/UserForm";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id)
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("users.update")}</h1>
      <UserForm initialData={user || undefined} />
    </div>
  );
}
