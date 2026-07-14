import * as React from "react";
import { cn } from "../lib/utils";

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="text-sm text-gray-500 mb-4">
    {items.map((item, index) => (
      <span key={index}>
        {item.href ? (
          <a href={item.href} className="hover:text-indigo-600">{item.label}</a>
        ) : (
          <span className="text-gray-800">{item.label}</span>
        )}
        {index < items.length - 1 && <span className="mx-2">/</span>}
      </span>
    ))}
  </nav>
);
