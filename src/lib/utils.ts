import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(ts: number | undefined): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  const min = diff / 60000;
  if (min < 1) return "Just now";
  if (min < 60) return `${Math.floor(min)}m ago`;
  const h = min / 60;
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = h / 24;
  return `${Math.floor(d)}d ago`;
}

export function getPresenceStatus(lastAction: number | undefined): { status: 'online' | 'idle' | 'offline'; color: string } {
  const diff = Date.now() - (lastAction || 0);
  const min = diff / 60000;
  if (min <= 3) return { status: 'online', color: 'bg-success' };
  if (min <= 30) return { status: 'idle', color: 'bg-warning' };
  return { status: 'offline', color: 'bg-muted-foreground' };
}
