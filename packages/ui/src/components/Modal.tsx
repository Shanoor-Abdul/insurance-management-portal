import * as React from "react";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
}: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="flex items-center justify-center p-4">
        <div
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl"
          role="dialog"
        >
          <div className="flex items-center justify-between border-b px-6 py-4">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-4">
            {children}
          </div>

          {footer && (
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
