import Link from "next/link";
import { auth } from "@/lib/auth";
import { DemoLoginButton } from "@/components/ui/DemoLoginButton";
import {
  Brain,
  Code2,
  CheckSquare,
  Flame,
  Globe,
  ArrowRight,
  Terminal,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
              <Brain className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight">
              SecondBrain<span className="text-indigo-400">.hub</span>
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100"
                >
                  Sign In
                </Link>
                <DemoLoginButton
                  label="Live Demo"
                  className="!px-4 !py-2 !text-xs"
                />
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>Full-Stack Personal Workspace for Developers</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Stop context-switching.{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Centralize your mind.
            </span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-zinc-400 sm:text-lg">
            A unified, distraction-free hub combining Markdown & code snippet
            notes, priority task execution, habit consistency heatmaps, and a
            public Digital Garden—built for daily engineering workflows.
          </p>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Open Your Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <DemoLoginButton label="Try One-Click Demo (No Sign-Up)" />
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
                >
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Instant sandbox pre-loaded with technical notes, active tasks & 30-day habit streaks.
          </p>
        </div>

        {/* Core Modules Grid */}
        <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-100">
              Markdown & Snippets
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Capture debugging logs, SQL queries, and architecture notes with
              syntax highlighting and instant tag search.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-100">
              Task & Priority Hub
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Turn study plans into daily execution with priority levels, due
              dates, and a focused daily dashboard.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-100">
              Habit Heatmap
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Track daily coding and reading routines with a GitHub-style
              contribution heatmap to visualize consistency.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-100">
              Public Digital Garden
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Toggle any private note to Public to generate a clean, shareable
              blog URL for peers or recruiters.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}