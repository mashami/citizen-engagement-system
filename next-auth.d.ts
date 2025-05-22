/* eslint-disable @typescript-eslint/no-unused-vars */
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string | null;
      role?: string; // 👈 Add this line
    };
  }

  interface User {
    role?: string; // 👈 Optional: extend the User model too
  }
}
