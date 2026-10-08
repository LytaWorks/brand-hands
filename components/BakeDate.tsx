"use client";

import { formatBakeDay, getBakeSchedule, useNow } from "@/lib/bake";

/** The Friday an order placed right now is baked on, e.g. "Friday 16 Oct". */
export default function BakeDate() {
  const now = useNow();
  return <>{now ? formatBakeDay(getBakeSchedule(now).bakeDay) : "Friday"}</>;
}
