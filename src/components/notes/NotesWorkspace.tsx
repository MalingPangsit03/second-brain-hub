"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Globe,
  Lock,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Edit3,
  Save,
  ArrowLeft,
} from "lucide-react";
import {
  createNote,
  updateNote,
  toggleNoteVisibility,
  deleteNote,
} from "@/app/(dashboard)/notes/actions";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface NoteWithTags {
  id: string;
  title: string;
  content: string;
  slug: string;
  isPublic: boolean;
  updatedAt: Date;
  tags: { id: string; name: string }[];
}

export function NotesWorkspace({ notes }: { notes: NoteWithTags[] }) {
  const [selectedId, setSelectedId] = useState<string | "NEW">(
    notes[0]?.id ?? "NEW"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedNote =
    selectedId === "NEW"
      ? null
      : notes.find((n) => n.id === selectedId) ?? null;

  // Controlled editor state synchronized when switching notes
  const [title, setTitle] = useState(selectedNote?.title ?? "");
  const [content, setContent] = useState(selectedNote?.content ?? "");
  const [tagsInput, setTagsInput] = useState(
    selectedNote?.tags.map((t) => t.name).join(", ") ?? ""
  );
  const [isPublic, setIsPublic] = useState(selectedNote?.isPublic ?? false);

  const handleSelectNote = (note: NoteWithTags) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.map((t) => t.name).join(", "));
    setIsPublic(note.isPublic);
    setPreviewMode(false);
  };

  const handleNewNote = () => {
    setSelectedId("NEW");
    setTitle("");
    setContent("");
    setTagsInput("");
    setIsPublic(false);
    setPreviewMode(false);
  };

  const handleCopyPublicUrl = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Collect unique tags across all notes
  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags.map((t) => t.name)))
  ).sort();

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      !activeTag || note.tags.some((t) => t.name === activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Write technical notes in Markdown and publish select entries to
            your Digital Garden.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>

          <button
            type="button"
            onClick={handleNewNote}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            New Note
          </button>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or code snippet..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTag === null
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  activeTag === tag
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Split View */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Notes List */}
        <div className="space-y-2.5 lg:col-span-4">
          {filteredNotes.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center text-xs text-zinc-500">
              No matching notes found.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = note.id === selectedId;
              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => handleSelectNote(note)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-indigo-500/50 bg-zinc-900"
                      : "border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-sm font-semibold text-zinc-100">
                      {note.title}
                    </h3>
                    {note.isPublic ? (
                      <Globe className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-zinc-400">
                    {note.content}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-400"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Markdown Editor & Preview */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 lg:col-span-8">
          {/* Public Digital Garden Banner (when editing an existing note) */}
          {selectedNote && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs">
                {selectedNote.isPublic ? (
                  <>
                    <Globe className="h-4 w-4 text-cyan-400" />
                    <span className="font-medium text-cyan-300">
                      Published to Digital Garden
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-400">Private Note</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedNote.isPublic && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopyPublicUrl(selectedNote.slug)}
                      className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                    >
                      {copiedSlug === selectedNote.slug ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Link
                        </>
                      )}
                    </button>
                    <Link
                      href={`/p/${selectedNote.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                    >
                      View Public
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await toggleNoteVisibility(selectedNote.id);
                      setIsPublic(!selectedNote.isPublic);
                    })
                  }
                  className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                >
                  {selectedNote.isPublic ? "Make Private" : "Publish"}
                </button>
              </div>
            </div>
          )}

          {/* Editor Form */}
          <form
            action={(formData) => {
              startTransition(async () => {
                if (selectedNote) {
                  await updateNote(selectedNote.id, formData);
                } else {
                  await createNote(formData);
                  handleNewNote();
                }
              });
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title (e.g., PostgreSQL Indexing Cheat Sheet)"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-base font-semibold text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="text"
                name="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tags (comma-separated: nextjs, sql, architecture)"
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />

              {/* Write / Preview Toggle */}
              <div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    !previewMode
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    previewMode
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="min-h-[320px] rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                {content ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="text-xs text-zinc-600">Nothing to preview yet.</p>
                )}
              </div>
            ) : (
              <textarea
                name="content"
                required
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes in Markdown... Use ```ts for syntax-styled code blocks."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            )}

            {/* Keep hidden textarea synced if user submits while in Preview tab */}
            {previewMode && (
              <input type="hidden" name="content" value={content} />
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Make publicly readable in Digital Garden</span>
              </label>

              <div className="flex items-center gap-2">
                {selectedNote && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(async () => {
                        await deleteNote(selectedNote.id);
                        handleNewNote();
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5"/>
                    Delete
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5"/>
                  {isPending
                    ? "Saving..."
                    : selectedNote
                    ? "Save Changes"
                    : "Create Note"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}