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
