import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") return new Date(date).toISOString().slice(0, 10)
  return date.toISOString().slice(0, 10)
}
