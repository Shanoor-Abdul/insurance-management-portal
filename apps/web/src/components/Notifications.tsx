"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button, Badge } from "@insurance/ui";
import { useAppStore } from "@insurance/lib";

export function Notifications() {
  const [open, setOpen] = useState(false);
  const notifications = useAppStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unread > 0 && <Badge variant="danger" className="absolute -right-1 -top-1 h-4 min-w-[1rem] px-1">{unread}</Badge>}
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border bg-white p-2 shadow-lg">
          {notifications.length === 0 ? (
            <p className="p-2 text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-2 text-sm ${n.read ? "text-gray-500" : "font-medium text-gray-900"}`}>
                <p>{n.title}</p>
                <p className="text-xs text-gray-400">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
