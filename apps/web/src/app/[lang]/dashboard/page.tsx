"use client";

import { useTranslation } from "react-i18next";
import { KPICards } from "@/components/KPICards";
import { DashboardCharts } from "@/components/DashboardCharts";
import { RecentActivity } from "@/components/RecentActivity";
import { QuickActions } from "@/components/QuickActions";

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
      <KPICards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCharts />
        <RecentActivity />
      </div>
      <QuickActions />
    </div>
  );
}
