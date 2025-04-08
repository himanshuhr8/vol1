import { NextRequest } from "next/server";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prismaClient } from "@/app/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        let existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          existingUser = await prismaClient.user.create({
            data: { email: user.email, provider: "Google", name: user.name! },
          });
        }

        user.id = existingUser.id;
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
  },
};

const handler = (req: NextRequest, ctx: { params: {} }) => {
  return NextAuth(authOptions)(req, ctx);
};

export const GET = handler;
export const POST = handler;
