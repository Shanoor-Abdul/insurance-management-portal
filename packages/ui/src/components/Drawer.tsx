import * as React from "react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right";
}

export const Drawer = ({ open, onClose, title, children, position = "right" }: DrawerProps) => {
  if (!open) return null;
  const sideClass = position === "right" ? "right-0" : "left-0";
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
        className={cn(
          "fixed top-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform",
          sideClass
        )}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </div>
    </div>
  );
};
