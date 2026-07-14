import * as React from "react";
import { cn } from "../lib/utils";

export const Loader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center p-8", className)}>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
  </div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
);
