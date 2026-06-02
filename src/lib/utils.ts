import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUpcomingSaturdayISO(): string {
  const today = new Date();
  const daysUntilSat = today.getDay() === 6 ? 0 : 6 - today.getDay();
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysUntilSat);
  return sat.toISOString().slice(0, 10);
}

export function isWeekendPast(weekendDate: string): boolean {
  const sun = new Date(weekendDate);
  sun.setDate(sun.getDate() + 1);
  sun.setHours(23, 59, 59, 999);
  return new Date() > sun;
}
