"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button, Badge } from "@insurance/ui";
import { useAppStore } from "@insurance/lib";

export function Notifications() {
  const [open, setOpen] = useState(false);
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const clearAllNotifications = useAppStore((s) => s.clearAllNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unread > 0 && <Badge variant="danger" className="absolute -right-1 -top-1 h-4 min-w-[1rem] px-1">{unread}</Badge>}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold text-gray-700">
              Notifications {notifications.length > 0 && `(${notifications.length})`}
            </span>
            <div className="flex gap-1">
              {unread > 0 && (
                <button className="text-xs text-indigo-600 hover:underline" onClick={handleMarkAllRead}>
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button className="text-xs text-red-500 hover:underline" onClick={clearAllNotifications}>
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <p className="p-3 text-center text-sm text-gray-400">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group flex items-start gap-2 rounded-md p-2 text-sm hover:bg-gray-50 ${
                    n.read ? "text-gray-500" : "font-medium text-gray-900"
                  }`}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      n.type === "success"
                        ? "bg-green-500"
                        : n.type === "error"
                        ? "bg-red-500"
                        : n.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{n.title}</p>
                    <p className="text-xs text-gray-400">{n.message}</p>
                    <p className="text-xs text-gray-300">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}