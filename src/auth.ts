import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { findUserByEmail } from "./lib/storage";
import { Role } from "./lib/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || process.env.GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_SECRET || "",
      profile(profile) {
        const email = profile.email || `${profile.login}@users.noreply.github.com`;
        const isAdmin = email.toLowerCase() === "admin@ptit.edu.vn";
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email,
          image: profile.avatar_url,
          role: (isAdmin ? "admin" : "user") as Role,
        };
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        const user = await findUserByEmail(email);
        if (!user) {
          return null;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || "class-deadline-hub-super-secret-key-ptit-2026",
});
