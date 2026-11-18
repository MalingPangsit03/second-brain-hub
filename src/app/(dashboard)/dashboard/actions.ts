"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Priority, Status } from "@prisma/client";

export async function toggleTaskStatus(taskId: string, currentStatus: Status) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const nextStatus: Status =
    currentStatus === "COMPLETED" ? "TODO" : "COMPLETED";

  await prisma.task.updateMany({
    where: { id: taskId, userId: session.user.id },
    data: { status: nextStatus },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function createQuickTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = String(formData.get("title") || "").trim();
  const priority = (String(formData.get("priority") || "MEDIUM") as Priority);

  if (!title) return;

  await prisma.task.create({
    data: {
      userId: session.user.id,
      title,
      priority,
      status: "TODO",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function toggleHabitToday(habitId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Normalize today's date to UTC midnight
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const existingLog = await prisma.habitLog.findFirst({
    where: {
      habitId,
      habit: { userId: session.user.id },
      completedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (existingLog) {
    await prisma.habitLog.delete({ where: { id: existingLog.id } });
  } else {
    await prisma.habitLog.create({
      data: {
        habitId,
        completedAt: today,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/habits");
}

export async function createHabit(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!title) return;

  await prisma.habit.create({
    data: {
      userId: session.user.id,
      title,
      description: description || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/habits");
}

export async function deleteHabit(habitId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.habit.deleteMany({
    where: { id: habitId, userId: session.user.id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/habits");
}