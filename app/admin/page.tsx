import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { NextRequest } from "next/server";
import { getAuthOptions } from "../api/auth/[...nextauth]/route";

import { OrderState, Role } from "@prisma/client";
import { prisma } from "../api/prisma-client";

import { OrderView } from "@/components/order";
import { PrimaryButton, SecondaryButton } from "@/components/input/buttons";
import { OrderButtons } from "./buttons";

export const metadata = {
  title: "Admin Panel | BRM CSGO",
  description: "CS GO Skins Marketplace",
};

export default async function Page(req: NextRequest) {
  const session = await getServerSession(getAuthOptions(req));

  if (!session || !session.user || session.user.role !== Role.ADMIN) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: {
      state: OrderState.TRADE,
    },
    include: {
      user: true,
    },
  });

  return (
    <main className="w-full my-6 flex flex-col justify-center items-center">
      <h1>Active orders</h1>

      {orders.length === 0 && <h3 className="mt-2">You have not made any orders</h3>}

      <div className="w-[700px] mt-12 flex flex-col space-y-6">
        {orders.reverse().map((order) => (
          <OrderView itemsLinks key={order.id} order={order}>
            <div className="w-full grid gap-4 mt-6">
              <SecondaryButton
                preventDefault={false}
                style={{
                  height: "40px",
                }}
              >
                <Link
                  href={order.user.trade_link!}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open trade link
                </Link>
              </SecondaryButton>

              <OrderButtons order={order} />
            </div>
          </OrderView>
        ))}
      </div>
    </main>
  );
}
