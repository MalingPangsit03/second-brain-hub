"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Brain, ArrowLeft, UserPlus } from "lucide-react";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Brain className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white">
              SecondBrain<span className="text-indigo-400">.hub</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">Create Your Account</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Set up your private workspace for notes, tasks, and daily habits.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              const res = await registerUser(formData);
              if (res?.error) setError(res.error);
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />
            {isPending ? "Creating Workspace..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}