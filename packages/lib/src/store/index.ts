import { create } from "zustand";
import { users, notifications as initialNotifications, auditLogs as initialAuditLogs } from "../data";
import type { User, Notification, AuditLog, Lang } from "../types";

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: AuditLog) => void;
  selectedPolicyIds: string[];
  togglePolicySelection: (id: string) => void;
  setSelectedPolicyIds: (ids: string[]) => void;
  clearSelectedPolicyIds: () => void;
  logout: () => void;
}

function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export const useAppStore = create<AppState>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
  user: getStoredUser(),
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
      else localStorage.removeItem("auth_user");
    }
    set({ user });
  },
  token: getStoredToken(),
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("auth_token", token);
      else localStorage.removeItem("auth_token");
    }
    set({ token, isAuthenticated: !!token });
  },
  isAuthenticated: !!getStoredToken() || !!getStoredUser(),
  notifications: initialNotifications,
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    })),
  clearAllNotifications: () => set({ notifications: [] }),
  auditLogs: initialAuditLogs,
  addAuditLog: (log) => set((state) => ({ auditLogs: [log, ...state.auditLogs] })),
  selectedPolicyIds: [],
  togglePolicySelection: (id) =>
    set((state) => ({
      selectedPolicyIds: state.selectedPolicyIds.includes(id)
        ? state.selectedPolicyIds.filter((p) => p !== id)
        : [...state.selectedPolicyIds, id]
    })),
  setSelectedPolicyIds: (ids) => set({ selectedPolicyIds: ids }),
  clearSelectedPolicyIds: () => set({ selectedPolicyIds: [] }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  }
}));