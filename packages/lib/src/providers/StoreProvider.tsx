"use client";

import * as React from "react";
import { useAppStore } from "../store";
import { users } from "../data";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    useAppStore.getState().setUser(users[0]);
  }, []);
  return <>{children}</>;
}
