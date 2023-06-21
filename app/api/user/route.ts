import { z } from "zod";

import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { getAuthOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../prisma-client";

export async function handler(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(getAuthOptions(req));

  if (!session) {
    return NextResponse.json(
      {
        error: "Not authorized",
      },
      {
        status: 401,
      }
    );
  }

  const updateSchema = z.object({
    trade_link: z
      .string({
        invalid_type_error: "Trade link must be a string",
      })
      .startsWith("https://steamcommunity.com/tradeoffer/new/", {
        message: "Invalid trade link",
      })
      .optional(),
  });

  try {
    var body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Required request body is missing",
      },
      {
        status: 400,
      }
    );
  }

  const update = updateSchema.safeParse(body);

  if (!update.success) {
    return NextResponse.json(
      {
        error: update.error,
      },
      {
        status: 422,
      }
    );
  }

  await prisma.user.update({
    where: {
      email: session.user?.email!,
    },
    data: update.data,
  });

  return NextResponse.json(update.data);
}

export { handler as PATCH };
