"use client";

import { useTranslation } from "react-i18next";
import { useAppStore } from "@insurance/lib";
import { Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";

export function RecentActivity() {
  const { t } = useTranslation();
  const logs = useAppStore((s) => s.auditLogs);

  return (
    <Card>
      <CardHeader><CardTitle>{t("dashboard.recentActivity")}</CardTitle></CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity.</p>
        ) : (
          <ul className="space-y-3">
            {logs.slice(0, 5).map((log) => (
              <li key={log.id} className="text-sm border-b pb-2 last:border-0">
                <p className="font-medium">{log.action}</p>
                <p className="text-xs text-gray-500">{log.user} • {log.target} • {log.timestamp}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
