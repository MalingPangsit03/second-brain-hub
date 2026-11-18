import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isDemo: { label: "Demo", type: "text" },
      },
      async authorize(credentials) {
        // 1. One-Click Demo Flow
        if (credentials?.isDemo === "true" || credentials?.isDemo === true) {
          const demoUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: "demo@secondbrain.dev" },
                { isDemoAccount: true },
              ],
            },
          });

          if (!demoUser) return null;

          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            isDemoAccount: demoUser.isDemoAccount,
          };
        }

        // 2. Standard Email/Password Flow
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isDemoAccount: user.isDemoAccount,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isDemoAccount = user.isDemoAccount;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
        session.user.isDemoAccount = Boolean(token.isDemoAccount);
      }
      return session;
    },
  },
});