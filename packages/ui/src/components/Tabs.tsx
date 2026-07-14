import * as React from "react";
import { cn } from "../lib/utils";

export interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => (
  <div className="flex border-b">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={cn(
          "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
          activeTab === tab.id
            ? "border-indigo-600 text-indigo-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
