"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || password.length < 6) {
    return { error: "Please provide a name, valid email, and a password (min 6 characters)." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      isDemoAccount: false,
      notes: {
        create: {
          title: "Welcome to Your Personal Second Brain",
          slug: `welcome-${Date.now()}`,
          isPublic: false,
          content: `# Getting Started\n\nUse this space to store technical notes, architecture decisions, and code snippets.\n\n- Toggle **Preview** to check Markdown formatting\n- Add tags to filter notes instantly\n- Toggle **Publish** to share any note via a public Digital Garden link`,
          tags: {
            connectOrCreate: [
              { where: { name: "personal" }, create: { name: "personal" } },
            ],
          },
        },
      },
      habits: {
        create: [
          {
            title: "Deep Work Session",
            description: "90 minutes of uninterrupted coding or study",
          },
          {
            title: "Daily Review & Planning",
            description: "Review tasks and log progress before wrapping up",
          },
        ],
      },
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created, please sign in manually." };
    }
    throw error; // Re-throw Next.js redirect
  }
}