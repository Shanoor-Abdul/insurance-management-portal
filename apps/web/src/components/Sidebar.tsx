"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, FileText, ClipboardList, Receipt, Users, Settings } from "lucide-react";
import { navigationPermissions, useAppStore, hasPermission } from "@insurance/lib";

const icons: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-5 w-5" />,
  policies: <FileText className="h-5 w-5" />,
  claims: <ClipboardList className="h-5 w-5" />,
  statements: <Receipt className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />
};

export function Sidebar({ lang }: { lang: string }) {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);

  const items = navigationPermissions.filter((item) => user && hasPermission(user, item.id));

  return (
    <aside className="w-64 border-r bg-white p-4 shadow-sm">
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${lang}${item.href}`}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          >
            {icons[item.id]}
            {t(`nav.${item.id}`)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
