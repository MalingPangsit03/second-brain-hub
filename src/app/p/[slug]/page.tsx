import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";
import { Brain, Calendar, User, ArrowLeft } from "lucide-react";

export default async function PublicDigitalGardenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const note = await prisma.note.findUnique({
    where: { slug },
    include: {
      tags: true,
      user: { select: { name: true } },
    },
  });

  if (!note || !note.isPublic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Minimal Public Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link className="flex items-center gap-2" href="/">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Brain className="h-4 w-4"/>
            </div>
            <span className="text-sm font-bold">
              SecondBrain<span className="text-indigo-400">.garden</span>
            </span>
          </Link>

          <Link className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200" href="/">
            <ArrowLeft className="h-3.5 w-3.5"/>
            Explore Workspace
          </Link>
        </div>
      </header>

      {/* Article Body */}
      <article className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-400"/>
              {note.user.name || "Developer"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-500"/>
              {new Date(note.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {note.title}
          </h1>

          {note.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <MarkdownRenderer content={note.content}/>
      </article>
    </div>
  );
}