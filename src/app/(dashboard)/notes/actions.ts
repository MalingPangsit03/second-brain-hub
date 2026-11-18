"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base || "note"}-${suffix}`;
}

function parseTags(rawTags: string): string[] {
  return Array.from(
    new Set(
      rawTags
        .split(",")
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter(Boolean)
    )
  );
}

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const rawTags = String(formData.get("tags") || "");
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !content) return;

  const tagNames = parseTags(rawTags);

  await prisma.note.create({
    data: {
      userId: session.user.id,
      title,
      content,
      slug: generateSlug(title),
      isPublic,
      tags: {
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
}

export async function updateNote(noteId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const rawTags = String(formData.get("tags") || "");
  const isPublic = formData.get("isPublic") === "on";

  if (!title || !content) return;

  const existing = await prisma.note.findFirst({
    where: { id: noteId, userId: session.user.id },
  });
  if (!existing) throw new Error("Note not found");

  const tagNames = parseTags(rawTags);

  await prisma.note.update({
    where: { id: noteId },
    data: {
      title,
      content,
      isPublic,
      tags: {
        set: [],
        connectOrCreate: tagNames.map((name) => ({
          where: { name },
          create: { name },
        })),
      },
    },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  revalidatePath(`/p/${existing.slug}`);
}

export async function toggleNoteVisibility(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: session.user.id },
  });
  if (!note) return;

  await prisma.note.update({
    where: { id: note.id },
    data: { isPublic: !note.isPublic },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  revalidatePath(`/p/${note.slug}`);
}

export async function deleteNote(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.note.deleteMany({
    where: { id: noteId, userId: session.user.id },
  });

  revalidatePath("/notes");
  revalidatePath("/dashboard");
}