"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { createHabit } from "@/app/(dashboard)/dashboard/actions";

export function CreateHabitForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createHabit(formData);
          formRef.current?.reset();
        });
      }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
    >
      <h2 className="mb-3 text-sm font-semibold text-white">Add a New Habit</h2>

      <div className="space-y-3">
        <div>
          <input
            type="text"
            name="title"
            required
            placeholder="Habit title (e.g., 1 Hour System Design Study)"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            name="description"
            placeholder="Optional description or target goal..."
            className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {isPending ? "Adding..." : "Create Habit"}
          </button>
        </div>
      </div>
    </form>
  );
}