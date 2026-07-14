"use client";

import { useEffect } from "react";
import { I18nProvider, QueryProvider, StoreProvider, isRtl, type Lang } from "@insurance/lib";
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

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";
  }, [lang]);

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
