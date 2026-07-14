"use client";

import { useTranslation } from "react-i18next";
import { Search, User, LogOut, Globe } from "lucide-react";
import { Input, Button } from "@insurance/ui";
import { useAppStore, type Lang } from "@insurance/lib";
import { useRouter, usePathname } from "next/navigation";
import { Notifications } from "./Notifications";

export function Header({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    const newPath = pathname.replace(`/${lang}`, `/${next}`);
    router.push(newPath);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-indigo-700">{t("app.name")}</div>
        <div className="hidden items-center gap-2 md:flex">
          <Search className="h-4 w-4 text-gray-400" />
          <Input className="w-64" placeholder={t("header.search")} />
        </div>
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
        </div>
        <Button variant="ghost" size="icon" aria-label={t("header.logout")}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
