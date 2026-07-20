"use client";

import { useTranslation } from "react-i18next";
import { useAppStore } from "@insurance/lib";
import { Card, CardHeader, CardTitle, CardContent } from "@insurance/ui";
import { Shield, Bell, Lock, Users, Palette } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const user = useAppStore((s) => s.user);
  const notifications = useAppStore((s) => s.notifications);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("nav.settings")}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile & Account */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <CardTitle>Profile & Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{user?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user?.email || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{user?.role || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="font-medium">{user?.department || "—"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Two-Factor Auth</span>
              <span className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">OTP Based</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Session</span>
              <span className="font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Last Login</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Unread Notifications</span>
              <span className="font-medium">{notifications.filter((n) => !n.read).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Notifications</span>
              <span className="font-medium">{notifications.length}</span>
            </div>
            <p className="text-xs text-gray-400">
              Notifications are generated for user actions like login, user creation, claim submission, policy assignments, etc.
            </p>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-indigo-600" />
              <CardTitle>Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Language</span>
              <span className="font-medium">{t("header.language")}: EN/AR</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Theme</span>
              <span className="font-medium">Light (Default)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Privileges</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                {user?.privileges?.length || 0} enabled
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <CardTitle>About</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <p><strong>{t("app.name")}</strong> - Insurance Management Portal</p>
          <p>Version 1.0.0</p>
          <p className="mt-2">A comprehensive enterprise solution for managing insurance policies, claims, statements, and users with role-based access control and multi-language support.</p>
        </CardContent>
      </Card>
    </div>
  );
}