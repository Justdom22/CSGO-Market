import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { Prisma, PrismaClient } from "@prisma/client";
import { getAuthOptions } from "../../auth/[...nextauth]/route";
import { Item } from "@/types";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(getAuthOptions(req));

  if (!session || !session.user) {
    return NextResponse.json(
      {
        error: "Not authorized",
      },
      {
        status: 401,
      }
    );
  }

  var prismaUser = await prisma.user.findUnique({
    where: {
      email: session.user?.email!,
    },
    include: {
      accounts: true,
    },
  });

  if (!prismaUser!.trade_link || prismaUser?.trade_link === "") {
    return NextResponse.json(
      {
        error: "Empty trade link",
      },
      {
        status: 403,
      }
    );
  }

  const body = await req.json();
  const items_hash_names: string[] = body["items"];

  const items = await Promise.all(
    items_hash_names.map(async (market_hash_name): Promise<Item> => {
      const res = await fetch(
        `${process.env.BASE_FETCH_URL}/api/items/${market_hash_name}`
      );
      const data = await res.json();

      return data["item"];
    })
  );

  if (items.length !== items_hash_names.length) {
    return new Response("Incorrect items data", {
      status: 400,
    });
  }

  const sum = items.map((item) => item.price).reduce((a, b) => a + b);

  if (prismaUser!.balance < sum) {
    return new Response("Balance insufficient", {
      status: 400,
    });
  }

  const orderItems = [
    ...items.map((item) => ({
      market_hash_name: item.market_hash_name,
    })),
  ] as Prisma.JsonArray;

  const createdOrder = await prisma.order.create({
    data: {
      userId: prismaUser?.id!,
      sum: sum,
      items: orderItems,
    },
  });

  await prisma.user.update({
    where: {
      email: prismaUser?.email!,
    },
    data: {
      balance: prismaUser!.balance - sum,
    },
  });

  return NextResponse.json(createdOrder);
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(getAuthOptions(req));

  if (!session || !session.user) {
    return NextResponse.json(
      {
        error: "Not authorized",
      },
      {
        status: 401,
      }
    );
  }

  var prismaUser = await prisma.user.findUnique({
    where: {
      email: session.user?.email!,
    },
    include: {
      orders: true
    },
  });

  return NextResponse.json(prismaUser?.orders.reverse());
}
