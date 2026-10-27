import type { NextAuthConfig } from "next-auth";
import { Role } from "./lib/types";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || "class-deadline-hub-super-secret-key-ptit-2026",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.id;
        token.role = (user.role as Role) || (token.role as Role) || "user";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || "user";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
