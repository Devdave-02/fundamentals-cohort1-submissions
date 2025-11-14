import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt";
import { signInSchema } from "@/app/(auth)/sign-in/_types/schema";

import { apiClient } from "./request";
import { SignInResponse } from "./types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      role?: string | null;
    };
    accessToken?: string;
  }

  interface User {
    role?: string | null;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string | null;
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const validated = signInSchema.parse(credentials);

        const response = await apiClient.post<SignInResponse>("/auth/login", {
          email: validated.email,
          password: validated.password,
        });

        if (!response) {
          throw new Error("Invalid email or password");
        }

        const { user } = response.data;

  
        return {
          id: user._id,
          email: user.email,
          role: user.role,
          accessToken: response.accessToken,
        };

      },
    }),
  ],

  pages: { signIn: "/sign-in" },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    jwt({ token, user }) {
      const clonedToken = { ...token };
      if (user) {
        clonedToken.id = user.id as string;
        clonedToken.role = user.role;
        clonedToken.accessToken = user.accessToken;
      }
      return clonedToken;
    },
    session({ session, token }) {
      const clonedSession = { ...session };
      if (clonedSession.user) {
        clonedSession.user.id = token.id;
        clonedSession.user.role = token.role;
      }
      clonedSession.accessToken = token.accessToken;
      return clonedSession;
    },
  },
});
