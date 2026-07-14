"use client";

import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";

export function QuickActions() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const router = useRouter();

  const actions = [
    { label: t("dashboard.quickActions.createUser"), href: `/${lang}/users/new` },
    { label: t("dashboard.quickActions.createPolicy"), href: `/${lang}/policies` },
    { label: t("dashboard.quickActions.assignPolicy"), href: `/${lang}/policies` },
    { label: t("dashboard.quickActions.viewClaims"), href: `/${lang}/claims` }
  ];

  return (
    <Card>
      <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {actions.map((a) => (
          <Button key={a.label} variant="outline" onClick={() => router.push(a.href)}>{a.label}</Button>
        ))}
      </CardContent>
    </Card>
  );
}
