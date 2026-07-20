"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18nProvider, QueryProvider, StoreProvider, isRtl, useAppStore, type Lang } from "@insurance/lib";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function LangLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const { lang } = params;
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isLoginPage = pathname.includes("/login");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";
  }, [lang]);

  // Auth guard: redirect to login if not authenticated (skip login page itself)
  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push(`/${lang}/login`);
    }
  }, [isAuthenticated, isLoginPage, lang, router]);

  // Login page uses its own layout (no sidebar/header)
  if (isLoginPage) {
    return (
      <I18nProvider lang={lang}>
        <QueryProvider>
          <StoreProvider>{children}</StoreProvider>
        </QueryProvider>
      </I18nProvider>
    );
  }

  // Don't render main layout if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <I18nProvider lang={lang}>
        <QueryProvider>
          <StoreProvider>
            <div className="flex h-screen items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          </StoreProvider>
        </QueryProvider>
      </I18nProvider>
    );
  }

  return (
    <I18nProvider lang={lang}>
      <QueryProvider>
        <StoreProvider>
          <div className="flex h-screen flex-col" dir={isRtl(lang) ? "rtl" : "ltr"}>
            <Header lang={lang} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar lang={lang} />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        </StoreProvider>
      </QueryProvider>
    </I18nProvider>
  );
}