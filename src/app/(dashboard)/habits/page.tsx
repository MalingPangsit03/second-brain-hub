import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { CreateHabitForm } from "@/components/dashboard/CreateHabitForm";
import { ArrowLeft } from "lucide-react";

export default async function HabitsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: {
      logs: {
        orderBy: { completedAt: "desc" },
        take: 60,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Habit Tracker & Streaks
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create custom daily habits and track consistency with your 35-day heatmap.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-2xl space-y-6">
        <CreateHabitForm />
        <HabitHeatmap habits={habits} allowDelete />
      </div>
    </div>
  );
}