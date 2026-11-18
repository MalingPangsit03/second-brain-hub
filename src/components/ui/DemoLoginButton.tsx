"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

interface DemoLoginButtonProps {
  className?: string;
  label?: string;
}

export function DemoLoginButton({
  className = "",
  label = "Try One-Click Demo",
}: DemoLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        isDemo: "true",
        redirect: false,
      });

      if (res?.error) {
        setError("Demo login failed. Make sure database is seeded.");
      } else if (res?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isLoading ? "Launching Workspace..." : label}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}