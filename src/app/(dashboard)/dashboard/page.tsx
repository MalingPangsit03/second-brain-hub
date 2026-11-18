import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuickTaskList } from "@/components/dashboard/QuickTaskList";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { FileText, Globe, Lock, ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [notes, tasks, habits] = await Promise.all([
    prisma.note.findMany({
      where: { userId: session.user.id },
      include: { tags: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.habit.findMany({
      where: { userId: session.user.id },
      include: {
        logs: {
          orderBy: { completedAt: "desc" },
          take: 40,
        },
      },
    }),
  ]);

  const activeTasksCount = tasks.filter((t) => t.status !== "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Daily Command Center
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Welcome back, {session.user.name || "Developer"}. Here is your daily
            snapshot.
          </p>
        </div>

        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
        >
          <FileText className="h-3.5 w-3.5" />
          Open Knowledge Base
        </Link>
      </div>

      {/* KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium text-zinc-400">Knowledge Notes</p>
          <p className="mt-1 text-2xl font-bold text-white">{notes.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium text-zinc-400">Pending Tasks</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {activeTasksCount}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium text-zinc-400">Active Habits</p>
          <p className="mt-1 text-2xl font-bold text-white">{habits.length}</p>
        </div>
      </div>

      {/* Main 2-Column Interactive Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickTaskList tasks={tasks} />
        <HabitHeatmap habits={habits} />
      </div>

      {/* Recent Notes Preview */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Recent Knowledge Notes
          </h2>
          <Link
            href="/notes"
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/70 p-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100">
                    {note.title}
                  </h3>
                  {note.isPublic ? (
                    <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400">
                      <Globe className="h-3 w-3" />
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                      <Lock className="h-3 w-3" />
                      Private
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
                  {note.content}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-inset ring-zinc-800"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}