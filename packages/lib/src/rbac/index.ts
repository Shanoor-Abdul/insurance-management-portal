import type { User, UserRole } from "../types";

export const privileges = [
  { id: "dashboard", label: "Dashboard" },
  { id: "policies", label: "Policies" },
  { id: "claims", label: "Claims" },
  { id: "statements", label: "Statements" },
  { id: "users", label: "Create User" },
  { id: "assignPolicy", label: "Assign Policy" },
  { id: "editPolicy", label: "Edit Policy" },
  { id: "deletePolicy", label: "Delete Policy" },
  { id: "viewReports", label: "View Reports" },
  { id: "settings", label: "Settings" }
] as const;

export type Privilege = (typeof privileges)[number]["id"];

export const rolePermissions: Record<UserRole, Privilege[]> = {
  admin: privileges.map((p) => p.id),
  manager: ["dashboard", "policies", "claims", "statements", "users", "assignPolicy", "editPolicy", "viewReports"],
  agent: ["dashboard", "policies", "claims", "assignPolicy"],
  viewer: ["dashboard", "policies", "claims", "statements"]
};

export function hasPermission(user: User | null, permission: Privilege): boolean {
  if (!user) return false;
  return user.privileges.includes(permission) || rolePermissions[user.role].includes(permission);
}

export const navigationPermissions = [
  { id: "dashboard", href: "/dashboard" },
  { id: "policies", href: "/policies" },
  { id: "claims", href: "/claims" },
  { id: "statements", href: "/statements" },
  { id: "users", href: "/users" }
] as const;
