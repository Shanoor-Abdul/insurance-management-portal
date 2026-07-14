"use client";

import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("nav.settings")}</h1>
      <Card>
        <CardHeader><CardTitle>Application Settings</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-600">Global settings will be configured here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
