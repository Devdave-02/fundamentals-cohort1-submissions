import {
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function toStringSafe(value: unknown): string {
  return value == null ? "" : String(value);
}

export const toNumberSafe = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

export function formatTwitterTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = differenceInSeconds(now, date);
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (seconds < 5) return "now"; 
  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  // If within this year, show "Oct 18"
  if (now.getFullYear() === date.getFullYear()) {
    return format(date, "MMM d");
  }

  // Older than a year → "Oct 18, 2024"
  return format(date, "MMM d, yyyy");
}
