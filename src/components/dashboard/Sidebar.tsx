"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Flame,
  LogOut,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    isDemoAccount?: boolean;
  };
  signOutAction: () => Promise<void>;
}

const navItems = [
  { href: "/dashboard", label: "Daily Hub", icon: LayoutDashboard },
  { href: "/notes", label: "Knowledge Base", icon: FileText },
  { href: "/tasks", label: "Tasks & Priorities", icon: CheckSquare },
  { href: "/habits", label: "Habit Tracker", icon: Flame },
];

export function Sidebar({ user, signOutAction }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col justify-between border-r border-zinc-800 bg-zinc-950 p-4">
      <div>
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 ring-1 ring-inset ring-indigo-500/30">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            SecondBrain<span className="text-indigo-400">.hub</span>
          </span>
        </Link>

        {/* Demo Indicator */}
        {user.isDemoAccount && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            <span>Demo Sandbox Mode</span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-900 text-white ring-1 ring-inset ring-zinc-800"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isActive ? "text-indigo-400" : "text-zinc-500"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="border-t border-zinc-800/80 pt-4">
        <div className="mb-3 px-2">
          <p className="truncate text-xs font-medium text-zinc-200">
            {user.name || "Developer"}
          </p>
          <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}