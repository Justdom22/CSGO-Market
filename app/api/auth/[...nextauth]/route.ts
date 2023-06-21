import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SteamProvider from "next-auth-steam";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import type { NextRequest } from "next/server";

import { prisma } from "../../prisma-client";

async function handler(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  // @ts-expect-error
  return NextAuth(req, ctx, getAuthOptions(req));
}

export function getAuthOptions(req: NextRequest): AuthOptions {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      SteamProvider(req, {
        clientSecret: process.env.STEAM_SECRET!,
        callbackUrl: `${process.env.BASE_FETCH_URL}/api/auth/callback`,
      }),
    ],
    callbacks: {
      async session({ session }) {
        const prismaUser = await prisma.user.findUnique({
          where: {
            email: session.user?.email!,
          },
          include: {
            accounts: true,
          },
        });

        const steamAccount = prismaUser?.accounts.find(a => a.provider == "steam");

        // @ts-expect-error
        session.user.trade_link = prismaUser?.trade_link;

        // @ts-expect-error
        session.user.role = prismaUser?.role;

        // @ts-expect-error
        session.user.balance = prismaUser?.balance;

        // @ts-expect-error
        session.user.steamId = steamAccount?.steamId;

        return session;
      },
    },
    secret: process.env.JWT_SECRET!,
  };
}

export { handler as GET, handler as POST };
