"use client";

import { useTranslation } from "react-i18next";
import { User, LogOut, Globe } from "lucide-react";
import { Button } from "@insurance/ui";
import { useAppStore, type Lang } from "@insurance/lib";
import { useRouter, usePathname } from "next/navigation";
import { Notifications } from "./Notifications";

export function Header({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    const newPath = pathname.replace(`/${lang}`, `/${next}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${lang}/login`);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-indigo-700">{t("app.name")}</div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={toggleLang}>
          <Globe className="h-4 w-4" />
          <span className="ml-2">{lang.toUpperCase()}</span>
        </Button>
        <Notifications />
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">{user?.name || "Guest"}</span>
          {user && (
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-600">
              {user.role}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" aria-label={t("header.logout")} onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}