import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotesWorkspace } from "@/components/notes/NotesWorkspace";

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    include: { tags: true },
    orderBy: { updatedAt: "desc" },
  });

  return <NotesWorkspace notes={notes}/>;
}