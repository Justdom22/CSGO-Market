import { z } from "zod";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";

import { OrderState, Role } from "@prisma/client";
import { prisma } from "@/app/api/prisma-client";

interface Props {
  params: {
    id: string;
  };
}

export async function handler(req: NextRequest, { params }: Props) {
  const session = await getServerSession(getAuthOptions(req));

  if (!session || session.user?.role !== Role.ADMIN) {
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
    state: z.nativeEnum(OrderState, {
      errorMap: (issue, _ctx) => {
        return { message: "Unknown order state" };
      },
    }),
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

  const updateResult = await prisma.order.updateMany({
    where: {
      id: parseInt(params.id),
      state: OrderState.TRADE,
    },
    data: update.data,
  });

  if (updateResult.count == 0) {
    return new Response("Failed to update order", {
      status: 404,
    });
  }

  return new Response(null, {
    status: 200,
  });
}

export { handler as PATCH };
