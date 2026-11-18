"use client";

import { useTransition } from "react";
import { Check, Flame, Trash2 } from "lucide-react";
import {
  toggleHabitToday,
  deleteHabit,
} from "@/app/(dashboard)/dashboard/actions";

interface HabitWithLogs {
  id: string;
  title: string;
  description: string | null;
  logs: { completedAt: Date }[];
}

export function HabitHeatmap({
  habits,
  allowDelete = false,
}: {
  habits: HabitWithLogs[];
  allowDelete?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const days: string[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  const todayStr = days[days.length - 1];

  const completionCounts: Record<string, number> = {};
  habits.forEach((habit) => {
    habit.logs.forEach((log) => {
      const dateKey = new Date(log.completedAt).toISOString().split("T")[0];
      completionCounts[dateKey] = (completionCounts[dateKey] || 0) + 1;
    });
  });

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-zinc-900 border-zinc-800";
    if (count === 1) return "bg-emerald-900/80 border-emerald-700/50";
    return "bg-emerald-500 border-emerald-400";
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">
            35-Day Consistency Heatmap
          </h2>
        </div>
        <span className="text-xs text-zinc-500">Last 5 weeks</span>
      </div>

      {/* Contribution Grid */}
      <div className="mb-5 grid grid-cols-7 gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-950 p-3">
        {days.map((day) => {
          const count = completionCounts[day] || 0;
          return (
            <div
              key={day}
              title={`${day}: ${count} habit(s) completed`}
              className={`h-5 w-full rounded-sm border transition ${getIntensityClass(
                count
              )}`}
            />
          );
        })}
      </div>

      {/* Today's Habit Check-Ins */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-400">
          Today&apos;s Check-Ins
        </p>
        {habits.length === 0 ? (
          <p className="py-4 text-center text-xs text-zinc-500">
            No habits tracked yet. Add one above to start building your streak!
          </p>
        ) : (
          habits.map((habit) => {
            const completedToday = habit.logs.some(
              (log) =>
                new Date(log.completedAt).toISOString().split("T")[0] === todayStr
            );

            return (
              <div
                key={habit.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/70 bg-zinc-950/60 px-3 py-2.5"
              >
                <div>
                  <p className="text-xs font-medium text-zinc-200">
                    {habit.title}
                  </p>
                  {habit.description && (
                    <p className="text-[11px] text-zinc-500">
                      {habit.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => toggleHabitToday(habit.id))
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      completedToday
                        ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {completedToday ? "Done Today" : "Check In"}
                  </button>

                  {allowDelete && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => deleteHabit(habit.id))
                      }
                      title="Delete habit"
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}