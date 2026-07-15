"use client";

import * as React from "react";
import { useAppStore } from "../store";
import { getCurrentUser } from "../api";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) useAppStore.getState().setUser(user);
    });
  }, []);
  return <>{children}</>;
}
