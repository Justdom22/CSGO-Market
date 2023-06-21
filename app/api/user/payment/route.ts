import { z } from "zod";

import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { getAuthOptions } from "../../auth/[...nextauth]/route";

import { PaymentMethod, PaymentRequest, PaymentResponse } from "@/types";
import { prisma } from "../../prisma-client";

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

  const paymentSchema = z.object({
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .min(1, { message: "The amount must be at least 1" }),
    paymentMethod: z.nativeEnum(PaymentMethod, {
      errorMap: (issue, _ctx) => {
        return { message: "Unknown payment method" };
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

  const paymentBody = paymentSchema.safeParse(body);

  if (!paymentBody.success) {
    return NextResponse.json(
      {
        error: paymentBody.error,
      },
      {
        status: 422,
      }
    );
  }

  var prismaUser = await prisma.user.findUnique({
    where: {
      email: session.user?.email!,
    },
  });

  const paymentRequest: PaymentRequest = {
    ...paymentBody.data,
    currency: "USD",
    paymentType: "DEPOSIT",
    returnUrl: process.env.BASE_FETCH_URL,
    webhookUrl: `${process.env.BASE_FETCH_URL}/api/user/payment/callback`
  };

  const response = await fetch(`${process.env.PAYMENT_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
    },
    body: JSON.stringify(paymentRequest),
  });

  const paymentResponse: PaymentResponse = await response.json();

  await prisma.payment.create({
    data: {
      serviceId: paymentResponse.result.id,
      userId: prismaUser?.id!,
      amount: paymentRequest.amount
    }
  })

  return NextResponse.json(paymentResponse, {
    status: paymentResponse.status,
  });
}

export { handler as POST };
