import { PrismaClient, Priority, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@secondbrain.dev";
  const passwordHash = await bcrypt.hash("DemoWorkspace123!", 10);

  await prisma.user.deleteMany({
    where: { email: demoEmail },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: demoEmail,
      name: "Alex Mercer (Demo)",
      passwordHash,
      isDemoAccount: true,
    },
  });

  // 1. Seed Notes with Tags
  await prisma.note.create({
    data: {
      userId: demoUser.id,
      title: "PostgreSQL Indexing & Query Optimization Cheat Sheet",
      slug: "postgresql-indexing-cheat-sheet",
      isPublic: true,
      content: `# PostgreSQL Indexing Strategies

When optimizing slow queries in production, always start with \`EXPLAIN ANALYZE\`.

## Common Index Types
- **B-Tree (Default):** Best for equality and range queries (\`=\`, \`<\`, \`>\`, \`BETWEEN\`).
- **GIN (Generalized Inverted Index):** Ideal for \`JSONB\`, arrays, and full-text search.

\`\`\`sql
-- Create a partial index for active records only
CREATE INDEX idx_active_tasks 
ON "Task" ("userId", "dueDate") 
WHERE status != 'COMPLETED';
\`\`\`

> **Tip:** Avoid over-indexing write-heavy tables since every \`INSERT\` or \`UPDATE\` must also update the index.`,
      tags: {
        connectOrCreate: [
          { where: { name: "PostgreSQL" }, create: { name: "PostgreSQL" } },
          { where: { name: "Backend" }, create: { name: "Backend" } },
          { where: { name: "Performance" }, create: { name: "Performance" } },
        ],
      },
    },
  });

  await prisma.note.create({
    data: {
      userId: demoUser.id,
      title: "TypeScript Discriminated Unions for API Responses",
      slug: "typescript-discriminated-unions",
      isPublic: false,
      content: `# Clean API State Handling

Using discriminated unions prevents impossible UI states (like having both \`data\` and \`error\` simultaneously).

\`\`\`typescript
export type ApiResponse<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function handleResponse(res: ApiResponse<string[]>) {
  if (res.status === "success") {
    console.log(res.data.length); // Type-safe access
  }
}
\`\`\``,
      tags: {
        connectOrCreate: [
          { where: { name: "TypeScript" }, create: { name: "TypeScript" } },
          { where: { name: "Architecture" }, create: { name: "Architecture" } },
        ],
      },
    },
  });

  // 2. Seed Tasks
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  await prisma.task.createMany({
    data: [
      {
        userId: demoUser.id,
        title: "Refactor authentication middleware & rate limiter",
        priority: Priority.HIGH,
        status: Status.IN_PROGRESS,
        dueDate: today,
      },
      {
        userId: demoUser.id,
        title: "Write unit tests for Markdown slug generator",
        priority: Priority.MEDIUM,
        status: Status.TODO,
        dueDate: today,
      },
      {
        userId: demoUser.id,
        title: "Review Prisma schema relations & cascade rules",
        priority: Priority.HIGH,
        status: Status.COMPLETED,
        dueDate: today,
      },
      {
        userId: demoUser.id,
        title: "Draft system architecture diagram for README",
        priority: Priority.LOW,
        status: Status.TODO,
        dueDate: tomorrow,
      },
    ],
  });

  // 3. Seed Habits & 30-Day Heatmap Logs
  const codingHabit = await prisma.habit.create({
    data: {
      userId: demoUser.id,
      title: "Deep Work & Coding (2 Hours)",
      description: "Distraction-free engineering session before noon",
    },
  });

  const readingHabit = await prisma.habit.create({
    data: {
      userId: demoUser.id,
      title: "Read Technical Docs / Engineering Blogs",
      description: "Read at least 1 architecture article daily",
    },
  });

  const logsToCreate = [];
  for (let i = 0; i < 30; i++) {
    const logDate = new Date();
    logDate.setDate(today.getDate() - i);
    logDate.setHours(12, 0, 0, 0);

    // Simulate realistic consistency (~80% completion)
    if (i % 5 !== 0) {
      logsToCreate.push({ habitId: codingHabit.id, completedAt: logDate });
    }
    if (i % 3 !== 0) {
      logsToCreate.push({ habitId: readingHabit.id, completedAt: logDate });
    }
  }

  await prisma.habitLog.createMany({
    data: logsToCreate,
  });

  console.log("✅ Seed completed! Demo account ready:", demoEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });