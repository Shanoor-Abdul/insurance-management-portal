import { format, parseISO } from "date-fns";

export function formatDate(date: string | Date, pattern = "yyyy-MM-dd"): string {
  try {
    return format(typeof date === "string" ? parseISO(date) : date, pattern);
  } catch {
    return String(date);
  }
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
