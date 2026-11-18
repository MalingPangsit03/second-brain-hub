"use client";

import { useTransition, useRef } from "react";
import { Priority, Status } from "@prisma/client";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import {
  toggleTaskStatus,
  createQuickTask,
} from "@/app/(dashboard)/dashboard/actions";

interface TaskItem {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
}

const priorityStyles: Record<Priority, string> = {
  HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  LOW: "bg-zinc-800 text-zinc-400 border-zinc-700",
};

export function QuickTaskList({ tasks }: { tasks: TaskItem[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Today&apos;s Focus Tasks</h2>
        <span className="text-xs text-zinc-500">
          {tasks.filter((t) => t.status === "COMPLETED").length}/{tasks.length} done
        </span>
      </div>

      {/* Quick Add Form */}
      <form
        ref={formRef}
        action={(formData) => {
          startTransition(async () => {
            await createQuickTask(formData);
            formRef.current?.reset();
          });
        }}
        className="mb-4 flex gap-2"
      >
        <input
          type="text"
          name="title"
          required
          placeholder="Add a quick task..."
          className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
        />
        <select
          name="priority"
          defaultValue="MEDIUM"
          className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Med</option>
          <option value="LOW">Low</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.length === 0 ? (
          <li className="py-6 text-center text-xs text-zinc-500">
            No tasks yet. Add one above to get started.
          </li>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === "COMPLETED";
            return (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/70 bg-zinc-950/60 px-3 py-2.5 transition hover:border-zinc-700"
              >
                <button
                  type="button"
                  onClick={() =>
                    startTransition(() => toggleTaskStatus(task.id, task.status))
                  }
                  className="flex items-center gap-2.5 text-left"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-zinc-600 hover:text-indigo-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isDone ? "text-zinc-500 line-through" : "text-zinc-200"
                    }`}
                  >
                    {task.title}
                  </span>
                </button>

                <span
                  className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold ${
                    priorityStyles[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}