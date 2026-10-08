"use client";

import {
  formatBakeDay,
  formatTimeLeft,
  getBakeSchedule,
  getWeekDays,
  useNow,
} from "@/lib/bake";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// The signature of the site: the weekly order, bake and deliver cycle,
// drawn as a strip with today marked.
export default function BakeWeek() {
  const now = useNow();
  const schedule = now ? getBakeSchedule(now) : null;
  const week = now ? getWeekDays(now) : null;
  const todayIndex = now ? (now.getUTCDay() + 6) % 7 : -1;

  let heading = "Order by Thursday 5pm for Friday's bake";
  let detail =
    "We bake on Friday morning and deliver that afternoon, Saturday and Sunday.";
  if (now && schedule) {
    const bakeDay = formatBakeDay(schedule.bakeDay);
    if (schedule.thisWeekClosed) {
      heading = `This week's orders are closed. Next bake is ${bakeDay}.`;
      detail =
        "Anything you order now is baked that Friday morning and delivered that afternoon or over the weekend.";
    } else {
      heading = `Order by Thursday 5pm for ${bakeDay}`;
      detail = `Orders close in ${formatTimeLeft(now, schedule.cutoff)}. We bake on Friday morning and deliver that afternoon, Saturday and Sunday.`;
    }
  }

  return (
    <section
      aria-labelledby="bake-week-heading"
      className="slip grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12 lg:p-8"
    >
      <div>
        <h2
          id="bake-week-heading"
          className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-2 max-w-md text-mocha">{detail}</p>
      </div>

      <div
        role="img"
        aria-label="The bake week: order from Monday to Thursday 5pm, baking on Friday morning, delivery from Friday afternoon to Sunday."
        className="grid grid-cols-7 gap-x-1.5 gap-y-1.5 sm:gap-x-2"
      >
        {DAYS.map((day, index) => {
          const isToday = index === todayIndex;
          return (
            <div
              key={day}
              className={`row-start-1 flex flex-col items-center rounded-field py-2 text-center ${
                isToday ? "bg-butter-soft" : ""
              }`}
            >
              <span
                className={`text-xs sm:text-sm ${isToday ? "font-bold" : "text-mocha"}`}
              >
                {isToday ? "Today" : day}
              </span>
              <span className="font-display text-lg font-semibold tabular-nums sm:text-xl">
                {week ? week[index].getUTCDate() : " "}
              </span>
            </div>
          );
        })}

        <span className="col-span-4 col-start-1 row-start-2 flex h-7 items-center rounded-full bg-butter px-3 text-xs font-semibold text-cocoa-deep sm:text-sm">
          Order
        </span>
        <span className="col-span-1 col-start-5 row-start-3 flex h-7 items-center justify-center rounded-full bg-cocoa text-xs font-semibold text-flour sm:text-sm">
          Bake
        </span>
        <span className="col-span-3 col-start-5 row-start-4 flex h-7 items-center rounded-full border border-cocoa px-3 text-xs font-semibold sm:text-sm">
          Deliver
        </span>
      </div>
    </section>
  );
}
