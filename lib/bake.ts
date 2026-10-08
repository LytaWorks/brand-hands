import { useSyncExternalStore } from "react";

// Ghana runs on GMT all year, so the whole schedule is computed in UTC.
const CUTOFF_DAY = 4; // Thursday
const CUTOFF_HOUR = 17;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface BakeSchedule {
  /** The Thursday 5pm deadline the next order has to beat. */
  cutoff: Date;
  /** The Friday that an order placed now is baked on. */
  bakeDay: Date;
  /** True from Thursday 5pm until the end of Sunday. */
  thisWeekClosed: boolean;
}

export function getBakeSchedule(now: Date): BakeSchedule {
  const daysToThursday = (CUTOFF_DAY - now.getUTCDay() + 7) % 7;
  let cutoff = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysToThursday,
      CUTOFF_HOUR,
    ),
  );
  if (now >= cutoff) cutoff = new Date(cutoff.getTime() + 7 * DAY_MS);

  const day = now.getUTCDay();
  const thisWeekClosed =
    day === 5 ||
    day === 6 ||
    day === 0 ||
    (day === CUTOFF_DAY && now.getUTCHours() >= CUTOFF_HOUR);

  return {
    cutoff,
    bakeDay: new Date(cutoff.getTime() + DAY_MS),
    thisWeekClosed,
  };
}

/** Monday to Sunday of the week `now` falls in. */
export function getWeekDays(now: Date): Date[] {
  const mondayOffset = (now.getUTCDay() + 6) % 7;
  const monday = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - mondayOffset,
  );
  return Array.from({ length: 7 }, (_, i) => new Date(monday + i * DAY_MS));
}

const dayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "Friday 16 Oct" */
export function formatBakeDay(date: Date) {
  return dayFormat.format(date).replace(",", "");
}

/** "2 days", "5 hours", "40 minutes" */
export function formatTimeLeft(from: Date, to: Date) {
  const minutes = Math.max(1, Math.round((to.getTime() - from.getTime()) / 60000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

/**
 * The current time, refreshed each minute. Null on the server and during
 * hydration, so anything date-dependent renders a neutral fallback first.
 */
export function useNow(): Date | null {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  return minute === null ? null : new Date(minute * 60_000);
}
