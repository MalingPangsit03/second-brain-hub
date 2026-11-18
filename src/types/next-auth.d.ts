import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isDemoAccount?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isDemoAccount?: boolean;
  }
}