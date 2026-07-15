import { create } from "zustand";
import { users, notifications as initialNotifications, auditLogs as initialAuditLogs } from "../data";
import type { User, Notification, AuditLog, Lang } from "../types";

interface AppState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: AuditLog) => void;
  selectedPolicyIds: string[];
  togglePolicySelection: (id: string) => void;
  setSelectedPolicyIds: (ids: string[]) => void;
  clearSelectedPolicyIds: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
  user: users[0] || null,
  setUser: (user) => set({ user }),
  notifications: initialNotifications,
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    })),
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
  clearSelectedPolicyIds: () => set({ selectedPolicyIds: [] })
}));
