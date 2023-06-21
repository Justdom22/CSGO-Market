import { NextRequest, NextResponse } from "next/server";

import { PaymentResponse } from "@/types";
import { prisma } from "@/app/api/prisma-client";

export async function handler(req: NextRequest, res: NextResponse) {
  type PaymentInfo = PaymentResponse["result"];

  var paymentCallback: PaymentInfo = await req.json();

  await prisma.payment.update({
    where: {
      serviceId: paymentCallback.id,
    },
    data: {
      state: "PAID",
      user: {
        update: {
          balance: { increment: paymentCallback.amount },
        },
      },
    },
    include: { user: true },
  });

  return new Response(null, {
    status: 200,
  });
}

export { handler as POST };
